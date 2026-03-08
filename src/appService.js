// Backend file that connects to the database. Includes queries.

const path = require('path');
const { Pool } = require('pg');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile(path.join(__dirname, '../.env'));

const pool = envVariables.DATABASE_URL
    ? new Pool({ connectionString: envVariables.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    : new Pool({
        user: envVariables.PGUSER,
        password: envVariables.PGPASSWORD,
        host: envVariables.PGHOST,
        port: parseInt(envVariables.PGPORT) || 5432,
        database: envVariables.PGDATABASE,
    });

async function initializeConnectionPool() {
    try {
        const client = await pool.connect();
        client.release();
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await pool.end();
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
// Wrapper to manage PostgreSQL actions, simplifying connection handling.
async function withPostgresDB(action) {
    const client = await pool.connect();
    try {
        return await action(client);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
}

// Helper: normalize pg result rows to UPPERCASE keys (matches Oracle OUT_FORMAT_OBJECT behavior)
function uppercaseKeys(rows) {
    return rows.map(row =>
        Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toUpperCase(), v]))
    );
}


// ----------------------------------------------------------
// Core functions for database operations
async function testDbConnection() {
    return await withPostgresDB(async (client) => {
        await client.query('SELECT 1');
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchRecipeFromDb() {
    return await withPostgresDB(async (client) => {
        const result = await client.query('SELECT * FROM Recipe ORDER BY ID ASC');
        return result.rows.map(row => Object.values(row));
    }).catch(() => {
        return [];
    });
}

async function initiateRecipe() {
    return await withPostgresDB(async (client) => {
        try {
            await client.query('DROP TABLE IF EXISTS Recipe CASCADE');
        } catch (err) {
            console.log("Recipe table did not exist, continuing...");
        }

        try {
            await client.query(`
                CREATE TABLE Recipe (
                ID INTEGER,
                title CHAR(100),
                time_consumed INTEGER,
                difficulty CHAR(20),
                cuisineID INTEGER,
                UNIQUE (title),
                PRIMARY KEY (ID),
                FOREIGN KEY (cuisineID) REFERENCES Cuisine(ID)
            )`);

            console.log("Recipe table created successfully");
            return true;

        } catch (err) {
            console.error("Error creating Recipe table:", err);
            return false;
        }

    }).catch((err) => {
        console.error("PostgreSQL failure:", err);
        return false;
    });
}

async function insertRecipe(customerID, id, title, time_consumed, difficulty, cuisineID) {
    return await withPostgresDB(async (client) => {
        const condition = await client.query(
            `SELECT C.name FROM Customer C WHERE C.ID = $1`,
            [customerID]
        );

        if (condition.rows.length === 0) {
            throw new Error("Customer ID does not exist!");
        }

        const condition2 = await client.query(
            `SELECT R.ID FROM Recipe R WHERE R.ID = $1`,
            [id]
        );

        if (condition2.rows.length > 0) {
            throw new Error("Recipe ID already exists. Choose different recipeID!");
        }

        const condition3 = await client.query(
            `SELECT R.title FROM Recipe R WHERE LOWER(TRIM(R.title)) = LOWER($1)`,
            [title]
        );

        if (condition3.rows.length > 0) {
            throw new Error("Recipe title already used. Choose different recipe title!");
        }

        try {
            const result = await client.query(
                `INSERT INTO Recipe (id, title, time_consumed, difficulty, cuisineID)
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, title, time_consumed, difficulty, cuisineID]
            );

            await client.query(
                `INSERT INTO AddRelation (CustomerID, RecipeID) VALUES ($1, $2)`,
                [customerID, id]
            );

            return result.rowCount > 0;

        } catch {
            return false;
        }
    });
}

async function fetchCustomerFromDb() {
    return await withPostgresDB(async (client) => {
        const result = await client.query(
            `
                SELECT C.ID, C.name, C.email_address, RC.cookingHistory, FC.ratingHistory
                FROM Customer C
                LEFT JOIN RecipeCreator RC ON C.ID = RC.ID
                LEFT JOIN FoodCritic FC ON C.ID = FC.ID
                ORDER BY C.ID
            `);
        return result.rows.map(row => Object.values(row));
    }).catch(() => {
        return [];
    });
}

// Query: SELECT FoodCritic or RecipeCreator and show all customer information for either one of those two categories.
async function selectCustomerType(type, name, andOr) {
    return await withPostgresDB(async (client) => {
        let SQL = `
            SELECT C.ID, C.name, C.email_address, RC.cookingHistory, FC.ratingHistory
            FROM Customer C
            LEFT JOIN RecipeCreator RC ON C.ID = RC.ID
            LEFT JOIN FoodCritic FC ON C.ID = FC.ID
        `;

        let conditions = [];
        if (type === "recipeCreator") conditions.push("RC.ID IS NOT NULL");
        if (type === "foodCritic") conditions.push("FC.ID IS NOT NULL");

        const binds = [];
        if (name && name.trim().length > 0) {
            binds.push(name);
            conditions.push(`LOWER(TRIM(C.name)) = LOWER($${binds.length})`);
        }

        if (conditions.length > 0) {
            SQL += " WHERE " + conditions.join(` ${andOr} `);
        }

        SQL += " ORDER BY C.ID";

        const result = await client.query(SQL, binds);
        return result.rows.map(row => Object.values(row));

    }).catch((err) => {
        console.error("selectCustomerType error:", err);
        return [];
    });
}

async function savedListCountTable() {
    return await withPostgresDB(async (client) => {
        try {
            const result = await client.query(`
                SELECT S.name AS savedListName, C.name AS ownerName, COUNT(S.recipeID) AS recipeCount
                FROM SavedLists S
                JOIN Customer C ON S.ownerID = C.ID
                GROUP BY S.name, C.name, S.ownerID
                ORDER BY C.name, S.name
            `);
            return result.rows.map(row => Object.values(row));
        } catch (err) {
            console.log("Error executing savedListCountTable:", err);
            return [];
        }
    });
}

async function findAllRecipes(ing1, ing2, ing3, ing4, ing5) {
    return await withPostgresDB(async (client) => {

        const inputIngs = [ing1, ing2, ing3, ing4, ing5]
            .map(x => x ? x.trim().toLowerCase() : "")
            .filter(x => x.length > 0);

        if (inputIngs.length === 0) {
            const result = await client.query(`SELECT ID, title FROM Recipe ORDER BY ID`);
            return result.rows.map(row => Object.values(row));
        }

        const placeholders = inputIngs.map((_, i) => `$${i + 1}`).join(", ");
        const binds = [...inputIngs, inputIngs.length];

        const SQL = `
            SELECT R.ID, R.title
            FROM Recipe R
            JOIN Contain C ON R.ID = C.RecipeID
            JOIN Ingredient I ON C.IngredientID = I.ID
            WHERE LOWER(TRIM(I.name)) IN (${placeholders})
            GROUP BY R.ID, R.title
            HAVING COUNT(DISTINCT LOWER(TRIM(I.name))) = $${binds.length}
        `;

        const result = await client.query(SQL, binds);
        return result.rows.map(row => Object.values(row));

    }).catch(err => {
        console.log("Error executing findAllRecipes:", err);
        return [];
    });
}


async function fetchIngredients() {
    return await withPostgresDB(async (client) => {
        const result = await client.query(`SELECT ID, name FROM Ingredient ORDER BY ID`);
        return uppercaseKeys(result.rows);
    }).catch((err) => {
        console.error("Error fetching ingredients:", err);
        return [];
    });
}

async function deleteIngredient(id) {
    return await withPostgresDB(async (client) => {
        try {
            const result = await client.query(
                `DELETE FROM Ingredient WHERE ID = $1`,
                [id]
            );
            if (!result.rowCount || result.rowCount === 0) {
                return { ok: false, reason: 'NOT_FOUND' };
            }
            return { ok: true };
        } catch (err) {
            console.error("Error deleting ingredient:", err);
            if (err.code === '23503') {  // PostgreSQL FK violation
                return { ok: false, reason: 'HAS_DEPENDENCIES' };
            }
            return { ok: false, reason: 'DB_ERROR' };
        }
    });
}

async function getCustomersByRecipeAndRating(recipeTitle, minStars) {
    return await withPostgresDB(async (client) => {
        const result = await client.query(
            `
            SELECT C.ID, C.name, C.email_address, R.stars
            FROM Customer C
            JOIN Rate   R  ON C.ID = R.CustomerID
            JOIN Recipe Re ON R.RecipeID = Re.ID
            WHERE LOWER(TRIM(Re.title)) LIKE '%' || LOWER(TRIM($1)) || '%'
              AND R.stars >= $2
            ORDER BY C.ID
            `,
            [recipeTitle, Number(minStars)]
        );
        return uppercaseKeys(result.rows);
    }).catch((err) => {
        console.error("Error in getCustomersByRecipeAndRating:", err);
        return [];
    });
}


async function getTopCuisinesByAvgRating() {
    return await withPostgresDB(async (client) => {
        const result = await client.query(
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
            `
        );
        return uppercaseKeys(result.rows);
    }).catch((err) => {
        console.error("Error in getTopCuisinesByAvgRating:", err);
        return [];
    });
}

// UPDATE, PROJECTION, AGGREGATION WITH HAVING Query Implementation
async function updateCustomer(id, newName, newEmail) {
    return await withPostgresDB(async (client) => {
        const existing = await client.query(
            `SELECT ID FROM Customer WHERE ID = $1`,
            [id]
        );
        if (existing.rows.length === 0) { return { ok: false, reason: 'NOT_FOUND' }; }
        await client.query(
            `
            UPDATE Customer
            SET
                name = COALESCE($1, name),
                email_address = COALESCE($2, email_address)
            WHERE ID = $3
            `,
            [newName || null, newEmail || null, id]
        );
        return { ok: true };
    }).catch(err => {
        console.error("Error updating customer:", err);
        return { ok: false, reason: 'DB_ERROR' };
    });
}


// PROJECTION
async function projectRecipe(attributes) {
    return await withPostgresDB(async (client) => {
        const columns = attributes.join(", ");
        const sql = `SELECT ${columns} FROM Recipe`;
        const result = await client.query(sql);
        return result.rows.map(row => Object.values(row));
    }).catch((err) => {
        console.error("Projection error:", err);
        return null;
    });
}

// AGGREGATION with HAVING: recipe title which has average rating >= threshold
async function getRecipesAboveAvgRating(threshold) {
    return await withPostgresDB(async (client) => {
        const result = await client.query(
            `
            SELECT R.title, AVG(RT.stars) AS avg_rating
            FROM Recipe R
            JOIN Rate RT ON R.ID = RT.RecipeID
            GROUP BY R.ID, R.title
            HAVING AVG(RT.stars) >= $1
            ORDER BY avg_rating DESC
            `,
            [Number(threshold)]
        );
        return uppercaseKeys(result.rows);
    }).catch((err) => {
        console.error("Error in getRecipesAboveAvgRating:", err);
        return [];
    });
}



module.exports = {
    testDbConnection,
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
