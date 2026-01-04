require("dotenv").config();
const knexConfig = require('./knexfile.js');
const knexConstructor = require('knex');
const { genPassword } = require('./customer/Utils/passwordUtils');

const environment = process.env.NODE_ENV || "development";
const knex = knexConstructor(knexConfig[environment]);

async function createAdmin() {
    try {
        console.log("Generating password...");
        const passwordData = await genPassword('admin123');

        const adminUser = {
            name: 'Admin',
            email: 'nguyenngocphu18062003@gmail.com',
            phone: '0000000000',
            password: passwordData.hashedPassword,
            salt: passwordData.salt,
            role: false, // Admin role as per index.route.js check (role === false)
            create_at: new Date(),
            update_at: new Date()
        };

        console.log("Checking if admin exists...");
        const existingUser = await knex('users').where({ email: 'nguyenngocphu18062003@gmail.com' }).first();

        if (existingUser) {
            console.log("User nguyenngocphu18062003@gmail.com already exists. Updating role to admin...");
            await knex('users').where({ email: 'nguyenngocphu18062003@gmail.com' }).update({
                role: false,
                password: passwordData.hashedPassword,
                salt: passwordData.salt,
                update_at: new Date()
            });
            console.log("Admin user updated successfully.");
        } else {
            console.log("Creating new admin user...");
            await knex('users').insert(adminUser);
            console.log("Admin user created successfully.");
        }

    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        await knex.destroy();
    }
}

createAdmin();
