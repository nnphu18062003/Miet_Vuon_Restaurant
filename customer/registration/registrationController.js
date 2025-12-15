const registrationService = require('./registrationService');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
var crypto = require('crypto');
const genPassword = require('../Utils/passwordUtils').genPassword;

const title = "Register - Miet Vuon Restaurant";

async function handleRegisterRequest(req, res) {
    try {
        const { name, email, password, passwordConfirm, agree } = req.body;
        if (!agree) {
            message = "Bạn cần đồng ý với các Điều khoản và Điều kiện.";
            return res.render("register", { message, title });
        }
    
        if (password !== passwordConfirm) {
            message = "Mật khẩu không khớp.";
            return res.render("register", { message, title });
        }
        
        const userCheck = await registrationService.findUserByEmail(email);
        if (userCheck) {
            message = "Email này đã được đăng ký. Vui lòng sử dụng email khác.";
            return res.render("register", { message, title });
        }

        try {
            const genPass = await genPassword(password);
            registrationService.createUser(name, email, genPass.hashedPassword, genPass.salt);
            res.redirect('login');
        } catch (error) {
            if (error.message.includes('crypto')) {
                console.error('Error generating password:', error);
                message = 'Có lỗi khi tạo mật khẩu. Vui lòng thử lại.';
                return res.render('register', { message, title });
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

async function renderRegistrationPage(req, res) {
    try {
        message = "";
        res.render('register', {  title });
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
};