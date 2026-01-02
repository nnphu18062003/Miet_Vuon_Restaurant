
require("dotenv").config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: "postgresql",
		connection: process.env.DB_CONNECTION_STRING || {
			host: process.env.DB_HOST || "localhost",
			user: process.env.DB_USERNAME || "postgres",
			password: process.env.DB_PASSWORD || "123",
			database: process.env.DB_NAME || "postgres",
			port: process.env.DB_PORT || 5432,
			charset: "utf8",
		},
		migrations: {
			directory: "./migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	},
	production: {
		client: "postgresql",
		connection: {
			connectionString: process.env.DB_CONNECTION_STRING,
			ssl: {
				rejectUnauthorized: false, // Required for many cloud providers (Azure/Heroku/Render)
			},
		},
		migrations: {
			directory: "./migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	},
};

