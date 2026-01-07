const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (to, token, name) => {
    // Determine base URL based on environment
    const baseUrl = process.env.BASE_URL || 'https://mietvuon.lunix.codes';
    const link = `${baseUrl}/register/verify?token=${token}`;

    const mailOptions = {
        from: `"Miet Vuon Restaurant" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Xác thực tài khoản - Miet Vuon Restaurant',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #66BB6A;">Chào mừng ${name} đến với Miệt Vườn!</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background-color: #66BB6A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Xác thực Email</a>
                </div>
                <p>Hoặc truy cập link sau: <a href="${link}">${link}</a></p>
                <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">Nếu bạn không yêu cầu đăng ký này, vui lòng bỏ qua email này.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail
};
