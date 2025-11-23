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

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RECIPE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRecipe() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE RECIPE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Recipe (
                ID INTEGER,
                title CHAR(100),
                time_consumed INTEGER,
                difficulty CHAR(20),
                cuisineID INTEGER,
                UNIQUE (title),
                PRIMARY KEY (ID),
                FOREIGN KEY (cuisineID) REFERENCES Cuisine(ID)
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRecipe(id, title, time_consumed, difficulty, cuisineID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Recipe (ID, title, time_consumed, difficulty, cuisineID)
                SELECT ID, title, time_consumed, difficulty, cuisineID
                WHERE NOT EXISTS (
                    SELECT * 
                    FROM RECIPE R1
                    WHERE R.ID = <ID> OR R.title = <title>
                )
                AND EXISTS (
                    SELECT * 
                    FROM Cuisine C
                    WHERE ID = cuisineID
            );`,
            [id, title, time_consumed, difficulty, cuisineID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Query: SELECT FoodCritic or RecipeCreator and show all customer information for either one of those two categories.
// (RecipeCreator has cookingHistory and FoodCritic has ratingHistory information shown as well)

async function selectCustomerType(type) {
    return await withOracleDB(async (connection) => {
        let sql;
        if (type === 'recipe_creator') {
            sql = `
                SELECT C.ID, C.name, C.email_address, RC.cookingHistory AS history
                FROM Customer C
                JOIN RecipeCreator RC ON C.ID = RC.ID
                ORDER BY C.ID
            `;
        } else if (type === 'food_critic') {
            sql = `
                SELECT C.ID, C.name, C.email_address, FC.ratingHistory AS history
                FROM Customer C
                JOIN FoodCritic FC ON C.ID = FC.ID
                ORDER BY C.ID
            `;
        } else {
            return []; // invalid type
        }

        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows; // return the actual rows
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE RECIPE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM RECIPE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateRecipe, 
    insertRecipe, 
    selectCustomerType,
    updateNameDemotable, 
    countDemotable
};