const express = require("express");
const authController = require("../controllers/auth.contoller");
const {verifyJwt} =require('../middlewares/auth.middleware');
const {upload} =require('../middlewares/multer.middleware');
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/user-info",verifyJwt,authController.getUserInfo);
router.put("/update-profile",verifyJwt,upload.single('profilePicture'),authController.updateprofile);
router.post("/signout",authController.signOut);

module.exports = router;
