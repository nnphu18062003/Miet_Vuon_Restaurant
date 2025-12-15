const router = require("express").Router();
const registerController = require("./registrationController");

router.post("/", registerController.handleRegisterRequest);
router.get("/",registerController.renderRegistrationPage);

module.exports = router;