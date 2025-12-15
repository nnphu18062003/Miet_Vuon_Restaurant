const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "PROD")
{
    // Production Pool
    pool = new Pool({
        connectionString: process.env.DB_CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false,
        },
        max: parseInt(process.env.DB_MAX_CLIENTS),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS),
    });
} 
else 
{
    // Development Pool
    pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        max: parseInt(process.env.DB_MAX_CLIENTS),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS),
    });
}

module.exports = pool;