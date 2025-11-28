// Backend file that connects to the database. Includes queries. 

const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// console.log("DB CONNECTING TO:", dbConfig);

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchRecipeFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Recipe ORDER BY ID ASC');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRecipe() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Recipe CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log("Recipe table did not exist, continuing...");
        }

        try {
            await connection.execute(`
                CREATE TABLE Recipe (
                ID INTEGER,
                title CHAR(100),
                time_consumed INTEGER,
                difficulty CHAR(20),
                cuisineID INTEGER,
                UNIQUE (title),
                PRIMARY KEY (ID),
                FOREIGN KEY (cuisineID) REFERENCES Cuisine(ID)
            )`, [], {autoCommit: true});

            console.log("Recipe table created successfully");
            return true;

        } catch (err) {
            console.error("Error creating Recipe table:", err);
            return false;
        }

    }).catch((err) => {
        console.error("Oracle failure:", err);
        return false;
    });
}

async function insertRecipe(customerID, id, title, time_consumed, difficulty, cuisineID) {
    return await withOracleDB(async (connection) => {
        const condition = await connection.execute(
            `SELECT C.name FROM Customer C WHERE C.ID = :customerID`,
            [customerID]
        );

        if (condition.rows.length === 0) {
            throw new Error("Customer ID does not exist!");
        }

        const condition2 = await connection.execute(
            `SELECT R.ID FROM Recipe R WHERE R.ID = :id`,
            [id]
        );

        if (condition2.rows.length > 0) {
            throw new Error("Recipe ID already exists. Choose different recipeID!");
        }

        const condition3 = await connection.execute(
            `SELECT R.title FROM Recipe R WHERE LOWER(TRIM(R.title)) = LOWER(:title)`,
            [title]
        );

        if (condition3.rows.length > 0) {
            throw new Error("Recipe title already used. Choose different recipe title!");
        }

        try {
            const result = await connection.execute(
                `INSERT INTO Recipe (id, title, time_consumed, difficulty, cuisineID) 
                 VALUES (:id, :title, :time_consumed, :difficulty, :cuisineID)`,
                [id, title, time_consumed, difficulty, cuisineID],
                { autoCommit: true }
            );

            await connection.execute(
                `INSERT INTO AddRelation (CustomerID, RecipeID)
                 VALUES (:customerID, :id)`,
                [customerID, id],
                { autoCommit: true }
            );

            return result.rowsAffected && result.rowsAffected > 0;

        } catch {
            return false; // rethrow other errors
        }
    });
}

async function fetchCustomerFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
                SELECT C.ID, C.name, C.email_address, RC.cookingHistory, FC.ratingHistory
                FROM Customer C
                LEFT JOIN RecipeCreator RC ON C.ID = RC.ID
                LEFT JOIN FoodCritic FC ON C.ID = FC.ID
                ORDER BY C.ID
            `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Query: SELECT FoodCritic or RecipeCreator and show all customer information for either one of those two categories.
// (RecipeCreator has cookingHistory and FoodCritic has ratingHistory information shown as well)

async function selectCustomerType(type, name, andOr) {
    return await withOracleDB(async (connection) => {
        // Base SQL: join both tables to get all possible info
        let SQL = `
            SELECT C.ID, C.name, C.email_address, RC.cookingHistory, FC.ratingHistory
            FROM Customer C
            LEFT JOIN RecipeCreator RC ON C.ID = RC.ID
            LEFT JOIN FoodCritic FC ON C.ID = FC.ID
        `;

        // Build conditions array
        let conditions = [];
        if (type === "recipeCreator") conditions.push("RC.ID IS NOT NULL");
        if (type === "foodCritic") conditions.push("FC.ID IS NOT NULL");
        if (name && name.trim().length > 0) conditions.push("LOWER(TRIM(C.name)) = LOWER(:name)");

        // Append WHERE clause if any conditions exist
        if (conditions.length > 0) {
            SQL += " WHERE " + conditions.join(` ${andOr} `);
        }

        // Order results
        SQL += " ORDER BY C.ID";

        // Prepare bind object
        const binds = (name && name.trim().length > 0) ? { name } : {};

        // Execute query
        const result = await connection.execute(SQL, binds, { autoCommit: true });

        return result.rows;
        
    }).catch((err) => {
        console.error("selectCustomerType error:", err);
        return [];
    });
}

async function savedListCountTable() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`
                SELECT S.name AS savedListName, C.name AS ownerName, COUNT(S.recipeID) AS recipeCount
                FROM SavedLists S
                JOIN Customer C ON S.ownerID = C.ID
                GROUP BY S.name, C.name, S.ownerID
                ORDER BY C.name, S.name
            `);
            return result.rows;
        } catch (err) {
            console.log("Error executing savedListCountTable:", err);
            return [];
        }
    });
}

async function findAllRecipes(ing1, ing2, ing3, ing4, ing5) {
    return await withOracleDB(async (connection) => {

        // Put all 5 into an array, lowercase and trim input
        const inputIngs = [ing1, ing2, ing3, ing4, ing5]
            .map(x => x ? x.trim().toLowerCase() : "")
            .filter(x => x.length > 0);   // keep only non-empty

        // If no ingredients → return all recipes
        if (inputIngs.length === 0) {
            const result = await connection.execute(
                `SELECT ID, title FROM Recipe ORDER BY ID`, 
                {},
                { autoCommit: true }
            );
            return result.rows;
        }

        // Base SQL
        let SQL = `
            SELECT R.ID, R.title
            FROM Recipe R
            JOIN Contain C ON R.ID = C.RecipeID
            JOIN Ingredient I ON C.IngredientID = I.ID
            WHERE LOWER(TRIM(I.name)) IN (
        `;

        // Create bind placeholders (:ing0, :ing1, :ing2...)
        const placeholders = inputIngs.map((_, i) => `:ing${i}`).join(", ");
        SQL += placeholders + ")";

        // Must match ALL specified ingredients
        SQL += `
            GROUP BY R.ID, R.title
            HAVING COUNT(DISTINCT LOWER(TRIM(I.name))) = :ingCount
        `;

        // Create bind object
        const binds = {};
        inputIngs.forEach((val, i) => binds[`ing${i}`] = val);
        binds.ingCount = inputIngs.length;

        const result = await connection.execute(SQL, binds, { autoCommit: true });
        return result.rows;

    }).catch(err => {
        console.log("Error executing findAllRecipes:", err);
        return [];
    });
}


async function fetchIngredients() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ID, name FROM Ingredient ORDER BY ID`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("Error fetching ingredients:", err);
        return [];
    });
}

async function deleteIngredient(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Ingredient WHERE ID = :id`,
            [id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error deleting ingredient:", err);
        return false;
    });
}

async function getCustomersByRecipeAndRating(recipeTitle, minStars) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT C.ID, C.name, C.email_address, R.stars
            FROM Customer C
            JOIN Rate   R  ON C.ID = R.CustomerID
            JOIN Recipe Re ON R.RecipeID = Re.ID
            WHERE LOWER(TRIM(Re.title)) LIKE '%' || LOWER(TRIM(:recipeTitle)) || '%'
              AND R.stars >= :minStars
            ORDER BY C.ID
            `,
            {
                recipeTitle,
                minStars: Number(minStars)
            },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("Error in getCustomersByRecipeAndRating:", err);
        return [];
    });
}


async function getTopCuisinesByAvgRating() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT Cu.style,
                   AVG(R.stars) AS avgCuisineRating
            FROM Cuisine Cu
            JOIN Recipe Re ON Cu.ID = Re.cuisineID
            JOIN Rate R   ON R.RecipeID = Re.ID
            GROUP BY Cu.style
            HAVING AVG(R.stars) >= ALL (
                SELECT AVG(R2.stars)
                FROM Cuisine Cu2
                JOIN Recipe Re2 ON Cu2.ID = Re2.cuisineID
                JOIN Rate R2   ON R2.RecipeID = Re2.ID
                GROUP BY Cu2.style
            )
            `,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("Error in getTopCuisinesByAvgRating:", err);
        return [];
    });
}

// UPDATE, PROJECTION, AGGREGATION WITH HAVING Query Implementation
// UPDATE: PK: ID
async function updateCustomer(id, newName, newEmail) {
    return await withOracleDB(async (connection) => {
        const SQL = `
            UPDATE Customer
            SET name = :newName,
                email_address = :newEmail
            WHERE ID = :id
        `;

        const binds = {
            newName,
            newEmail,
            id
        };

        const result = await connection.execute(SQL, binds, { autoCommit: true });
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error updating customer:", err);
        return false;
    });
}


// PROJECTION 
async function projectRecipe(attributes) {
    return await withOracleDB(async (connection) => {
        const columns = attributes.join(", ");
        const sql = `SELECT ${columns} FROM Recipe`;

        const result = await connection.execute(sql, [], {
            outFormat: oracledb.OUT_FORMAT_ARRAY
        });

        return result.rows;
    }).catch((err) => {
        console.error("Projection error:", err);
        return null;
    });
}

// AGGREGATION with HAVING: recipe title which has average rating >= threshold
async function getRecipesAboveAvgRating(threshold) {
    return await withOracleDB(async (connection) => {
        const SQL = `
            SELECT R.title, AVG(RT.stars) AS avg_rating
            FROM Recipe R
            JOIN Rate RT ON R.ID = RT.RecipeID
            GROUP BY R.ID, R.title
            HAVING AVG(RT.stars) >= :threshold
            ORDER BY avg_rating DESC
        `;

        const result = await connection.execute(
            SQL,
            { threshold },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    }).catch((err) => {
        console.error("Error in getRecipesAboveAvgRating:", err);
        return [];
    });
}



module.exports = {
    testOracleConnection,
    fetchRecipeFromDb,
    initiateRecipe, 
    insertRecipe, 
    fetchCustomerFromDb,
    selectCustomerType,
    savedListCountTable,
    findAllRecipes,
    fetchIngredients,
    deleteIngredient,
    getCustomersByRecipeAndRating,
    getTopCuisinesByAvgRating,
    updateCustomer,
    projectRecipe,
    getRecipesAboveAvgRating,
};