const router = require("express").Router();
const profileController = require("./profileController");
const utils = require("../Utils/jwtUtils");

router.get("/", utils.authMiddleware({ session: true }), profileController.renderProfilePage);
router.post("/address/create", profileController.createUserAddress);
router.post("/address/update",profileController.updateUserAddressInfo);
router.post("/profile/update",profileController.updateUserProfile)
router.delete("/address/:addressId",profileController.deleteUserAddress);
// router.get("/verify-email", profileController.verifyEmail);
// router.post("/change-password", utils.authMiddleware({ session: true }), profileController.changePassword);

module.exports = router;