const router = require("express").Router();
const messagesController = require("../controllers/messages.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const {upload} =require('../middlewares/multer.middleware');

router.post("/get-messages", verifyJwt, messagesController.getMessages);
router.post("/upload-file", verifyJwt, upload.single("file"), messagesController.uploadFile);

module.exports = router;
