const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validPassword = require('../Utils/passwordUtils').validPassword;
const loginService = require('./loginService');
const title = "Login - Miet Vuon Restaurant";

const verifyCallback = async (email, password, done) => {
    try {
        message = "Email hoặc mật khẩu không đúng.";
        const user = await loginService.findUserByEmail(email);
        if (!user) {
            return done(null, false, { message, title });
        }

        // Block if email not verified
        if (!user.email_verified) {
            return done(null, false, { message: 'Tài khoản chưa được xác thực email. Vui lòng kiểm tra hộp thư đến.', title });
        }

        // Block if status is not active (e.g. locked)
        // If your DB uses boolean 'true' for status active, or string 'active'. 
        // Based on registrationController, usage is mixed boolean/string. 
        // The registration sets 'role: true', 'email_verified: false'. 
        // Let's rely on email_verified for now or check if there is a specific status field.
        // Looking at toggleStatus in admin, it updates 'status'. 
        // Let's assume 'active' or boolean true is required if status column exists.
        // Use loose check or check DB schema. For now, email_verified is key.

        const isValid = await validPassword(password, user.password, user.salt);

        if (isValid) {
            return done(null, user, { title });
        } else {
            return done(null, false, { message, title });
        }
    } catch (err) {
        done(err);
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
    try {
        const user = await loginService.findUserById(userId);
        if (user) {
            return done(null, user)
        }
    } catch (err) {
        done(err);
    }
})
const cus_strategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    verifyCallback
);
passport.use('cus_strategy', cus_strategy);