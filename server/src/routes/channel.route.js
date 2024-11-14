const router = require("express").Router();
const channelController = require("../controllers/channel.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
router.post("/create-channel", verifyJwt, channelController.createChannel);
router.get("/get-user-channels", verifyJwt, channelController.getUserChannels);
router.get("/get-channel-messages/:channelId",verifyJwt, channelController.getChannelMessages);

module.exports = router;
