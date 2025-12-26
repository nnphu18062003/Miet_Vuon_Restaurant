const express = require('express');
const passport = require('passport');
const router = express.Router();

require('./login/passport.js');

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
    
    // Add other admin routes here as needed
};

