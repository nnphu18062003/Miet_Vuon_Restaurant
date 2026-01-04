const { genPassword } = require('../customer/Utils/passwordUtils');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

if (!email || !password) {
    console.log('Usage: node scripts/create_admin.js <email> <password> [name]');
    process.exit(1);
}

async function createAdmin() {
    try {
        const { salt, hashedPassword } = await genPassword(password);

        await knex('users').insert({
            email,
            password: hashedPassword,
            salt,
            name,
            role: false, // false = admin
            create_at: new Date(),
            update_at: new Date()
        });

        console.log(`Admin user ${email} created successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
