require("dotenv").config();
const { Client } = require("pg");

async function createDatabase() {
	let client;
	if(process.env.NODE_ENV === "PROD")
	{
		//production
		client = new Client({
			connectionString: process.env.DB_CONNECTION_STRING,
			ssl: {
				rejectUnauthorized: false,
			},
		});
	}
	else
	{
		//development
		client = new Client({
			host: process.env.DB_HOST,
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT,
			database: "postgres", // Connect to the default database
		});
	}
	
	try {
		await client.connect();
		const res = await client.query(
			`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}';`
		);
		if (res.rowCount === 0) {
			await client.query(
				`CREATE DATABASE "${process.env.DB_NAME}";`
			);
			console.log(
				`Database ${process.env.DB_NAME} created successfully.`
			);
		} else {
			console.log(
				`Database ${process.env.DB_NAME} already exists.`
			);
		}
	} catch (err) {
		console.error("Error creating database: ", err);
	} finally {
		await client.end();
	}
}

createDatabase();
