
require("dotenv").config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: "postgresql",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD || "",
			database: process.env.DB_NAME,
			port: parseInt(process.env.DB_PORT) || 5432,
			charset: "utf8",
		},

		migrations: {
			directory: "./migrations",
		},

		seeds: {
			directory: "./seeds",
		},
	},
	production:{
		client: "postgresql",
		connection: {
			connectionString: process.env.DB_CONNECTION_STRING,
			ssl: {
				rejectUnauthorized: false,
			},
			charset: "utf8",
		},
		
		migrations: {
			directory: "./migrations",
		},
		seeds: {
			directory: "./seeds",
		},
	}
};

