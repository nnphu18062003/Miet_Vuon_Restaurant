const router = require("express").Router();
const passport = require("passport");
const loginController = require("./loginController");
require('./passport_cus.js');

router.post("/",passport.authenticate('cus_strategy',{
    failureRedirect: '/login',
    successRedirect: '/category',
    failureFlash: true,
}));

router.get("/",loginController.renderLoginPage);

module.exports = router;