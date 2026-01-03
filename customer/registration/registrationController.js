const registrationService = require('./registrationService');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
var crypto = require('crypto');
const genPassword = require('../Utils/passwordUtils').genPassword;
const emailService = require('../../services/emailService');
const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

const title = "Register - Miet Vuon Restaurant";

async function handleRegisterRequest(req, res) {
    try {
        const { name, email, password, passwordConfirm, agree } = req.body;
        if (!agree) {
            req.flash('error', 'Bạn cần đồng ý với các Điều khoản và Điều kiện.');
            return res.redirect('/register');
        }

        if (password !== passwordConfirm) {
            req.flash('error', 'Mật khẩu không khớp.');
            return res.redirect('/register');
        }

        const userCheck = await registrationService.findUserByEmail(email);
        if (userCheck) {
            req.flash('error', 'Email này đã được đăng ký. Vui lòng sử dụng email khác.');
            return res.redirect('/register');
        }

        try {
            console.log('Generating password...');
            const genPass = await genPassword(password);

            console.log('Generating token...');
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            console.log('Inserting user into DB...');
            const [newUser] = await knex('users').insert({
                name: name,
                email: email,
                password: genPass.hashedPassword,
                salt: genPass.salt,
                role: true,
                verification_token: verificationToken,
                verification_token_expires: tokenExpires,
                email_verified: false,
                status: 'active', // Set active by default (login blocked by verify check)
                create_at: new Date(),
                update_at: new Date()
            }).returning('*');
            console.log('User inserted:', newUser.id);

            // Send verification email
            console.log('Sending verification email...');
            try {
                await emailService.sendVerificationEmail(email, verificationToken, name);
                console.log('Email sent successfully.');
            } catch (emailError) {
                console.error('Failed to send email (continuing anyway):', emailError);
                // Optionally flash a warning that email failed, but for now let's allow registration to "succeed"
            }

            // Flash success message
            req.flash('success', 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
            console.log('Redirecting to login...');
            return res.redirect('/login');

        } catch (error) {
            if (error.message.includes('crypto')) {
                console.error('Error generating password:', error);
                console.error('Error generating password:', error);
                req.flash('error', 'Có lỗi khi tạo mật khẩu. Vui lòng thử lại.');
                return res.redirect('/register');
            }
            console.error('Error handler register:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
                getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            );
        }

    } catch (error) {
        console.error('Error handler register:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        );
    }
}

async function verifyEmail(req, res) {
    try {
        const { token } = req.query;
        if (!token) {
            return res.render('login', { message: 'Mã xác thực không hợp lệ.', title: "Login - Miet Vuon Restaurant" });
        }

        const user = await knex('users')
            .where('verification_token', token)
            .where('verification_token_expires', '>', new Date())
            .first();

        if (!user) {
            return res.render('login', { message: 'Link xác thực đã hết hạn hoặc không tồn tại.', title: "Login - Miet Vuon Restaurant" });
        }

        // Verify user
        await knex('users').where('id', user.id).update({
            email_verified: true,
            verification_token: null,
            verification_token_expires: null,
            status: 'active' // Ensure active
        });

        return res.render('login', { message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.', title: "Login - Miet Vuon Restaurant" });

    } catch (error) {
        console.error('Verify Email Error:', error);
        return res.render('login', { message: 'Có lỗi xảy ra khi xác thực email.', title: "Login - Miet Vuon Restaurant" });
    }
}

async function renderRegistrationPage(req, res) {
    try {
        message = "";
        res.render('register', { title, message: '' });
    } catch (error) {
        console.error('Error handler register:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        );
    }
}

module.exports = {
    handleRegisterRequest,
    renderRegistrationPage,
    verifyEmail // Export new function
};