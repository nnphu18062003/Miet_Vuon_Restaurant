const router = require("express").Router();
const registerController = require("./registrationController");

router.post("/", registerController.handleRegisterRequest);
router.get("/verify", registerController.verifyEmail);
router.get("/", registerController.renderRegistrationPage);

module.exports = router;