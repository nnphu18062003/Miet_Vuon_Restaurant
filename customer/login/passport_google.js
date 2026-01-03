const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const registrationService = require('../registration/registrationService');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async function (accessToken, refreshToken, profile, done) {
            try {
                // Check if user exists by google_id
                let user = await knex('users').where('google_id', profile.id).first();

                if (user) {
                    // User exists, login
                    return done(null, user);
                } else {
                    // Check if email exists
                    const email = profile.emails[0].value;
                    user = await knex('users').where('email', email).first();

                    if (user) {
                        // Link account
                        await knex('users').where('id', user.id).update({
                            google_id: profile.id,
                            email_verified: true // Google emails are verified
                        });
                        return done(null, user);
                    } else {
                        // Create new user
                        // We'll use a random password since they use Google
                        const randomPassword = Math.random().toString(36).slice(-8);
                        const name = profile.displayName;

                        // Use existing service if possible, or insert directly
                        // Calling service might hash password for us
                        // But registrationService expects specific format. Let's do manual insert or adapt service.
                        // Let's rely on manual insert to ensure google_id is set

                        const { genPassword } = require('../../customer/Utils/passwordUtils');
                        const passwordData = await genPassword(randomPassword);

                        const [newUser] = await knex('users').insert({
                            name: name,
                            email: email,
                            password: passwordData.hashedPassword,
                            salt: passwordData.salt,
                            google_id: profile.id,
                            role: true, // Customer
                            email_verified: true,
                            create_at: new Date(),
                            update_at: new Date()
                        }).returning('*');

                        return done(null, newUser);
                    }
                }
            } catch (err) {
                return done(err, null);
            }
        }
    ));
} else {
    console.warn('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing. Google Login disabled.');
}

// Serialization is already handled in passport_cus.js if loaded.
// If passport_cus.js is loaded first, it defines serialize/deserialize.
// However, deserializeUser there uses `loginService.findUserById`.
// We need to ensure that works for all users. It likely does since it queries by ID.
