const express = require('express');
const passport = require('passport');
const router = express.Router();

require('./login/passport.js');

// Middleware để kiểm tra admin đã đăng nhập chưa
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === false) {
        return next();
    }
    res.redirect('/admin/login');
}

module.exports = function(app) {
    app.use('/admin', router);
    
    router.get('/login', (req, res) => {
        res.render('admin_views/admin_login', { error: req.flash('error') });
    });
    
    router.post('/login', passport.authenticate('admin_strategy', {
        failureRedirect: '/admin/login',
        successRedirect: '/admin/dashboard',
        failureFlash: true,
    }));
    
    // Dashboard route
    router.get('/dashboard', ensureAdmin, (req, res) => {
        // TODO: Lấy dữ liệu thực từ database
        // Tạm thời dùng dữ liệu mẫu
        res.render('admin_views/admin_index', {
            revenue: 0,
            totalOrder: 0,
            customers: 0
        });
    });
    
    // Redirect /admin về /admin/dashboard
    router.get('/', ensureAdmin, (req, res) => {
        res.redirect('/admin/dashboard');
    });
    
    // Add other admin routes here as needed
};

