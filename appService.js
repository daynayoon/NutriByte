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
        const result = await connection.execute('SELECT * FROM Recipe');
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

async function insertRecipe(id, title, time_consumed, difficulty, cuisineID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Recipe (id, title, time_consumed, difficulty, cuisineID) 
            VALUES (:id, :title, :time_consumed, :difficulty, :cuisineID)`,
            [id, title, time_consumed, difficulty, cuisineID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error inserting into Recipe table:", err);
        return false;
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
            JOIN Rate R ON C.ID = R.CustomerID
            JOIN Recipe Re ON R.RecipeID = Re.ID
            WHERE Re.title = :recipeTitle
              AND R.stars >= :minStars
            ORDER BY C.ID
            `,
            { recipeTitle, minStars },
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
async function updateCustomer(customerId, newName, newEmail) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            UPDATE Customer
            SET name = :newName,
                email_address = :newEmail
            WHERE ID = :customerId
            `,
            {
                customerId,
                newName,
                newEmail
            },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error updating Customer:", err);
        return false;
    });
}

// PROJECTION (Ingredient attributes) seelct ID, name or name
async function projectIngredients(selectedColumns) {
    return await withOracleDB(async (connection) => {
        if (!Array.isArray(selectedColumns) || selectedColumns.length === 0) {
            return [];
        }

        const columnSQL = selectedColumns.join(", ");

        const result = await connection.execute(
            `
            SELECT ${columnSQL}
            FROM Ingredient
            ORDER BY ID
            `,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows;
    }).catch((err) => {
        console.error("Error in projectIngredients:", err);
        return [];
    });
}

// AGGREGATION with HAVING: recipe title which has average rating >= threshold
async function getRecipesByMinAvgRating(threshold) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `
            SELECT R.title, AVG(RT.stars) AS avg_rating
            FROM Recipe R
            JOIN Rate RT ON R.ID = RT.RecipeID
            GROUP BY R.ID, R.title
            HAVING AVG(RT.stars) >= :threshold
            ORDER BY avg_rating DESC
            `,
            { threshold },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    }).catch((err) => {
        console.error("Error in getRecipesByMinAvgRating:", err);
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
    fetchIngredients,
    deleteIngredient,
    getCustomersByRecipeAndRating,
    getTopCuisinesByAvgRating,
    updateCustomer,
    projectIngredients,
    getRecipesByMinAvgRating,
};