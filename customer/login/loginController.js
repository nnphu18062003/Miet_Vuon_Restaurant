const loginService = require('./loginService');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const validPassword=require('../Utils/passwordUtils').validPassword;
const utils=require('../Utils/jwtUtils');
const title = "Login - Supershop - GA05";

async function handleLoginRequest(req, res, next) {
    try{
        const {email, password} = req.body;
        const user= await loginService.findUserByEmail(email);
        if(!user){
            message =
                "Incorrect Email or Password!.";
            return res.render("login", { message, title });
        }
        const isValid=await validPassword(password,user.password,user.salt);

        if(isValid){
            const tokenObject = utils.issueJWT(user);
            res.cookie('token', tokenObject.token, {
                httpOnly: false, 
                secure: true,   
                maxAge: 3600000 
            });
            
            return res.redirect('/mobilephones');
        }
        else {
            message =
                "Incorrect Email or Password!.";
            return res.render("login", { message, title});
        }
    }
    catch(err){
        return next(err);
    }
        
}

async function renderLoginPage(req, res) {
    try {
        message="";
        const user = req.session.user || null;
        res.render('login', {
            title,
            user: user,
        });
    } catch (error) {
        console.error('Error handler login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        );
    }
}

module.exports = {
    handleLoginRequest,
    renderLoginPage,
};