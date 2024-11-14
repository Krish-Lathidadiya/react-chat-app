const router = require("express").Router();
const contactController = require("../controllers/contacts.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.post("/search", verifyJwt, contactController.searchContacts);
router.get("/get-contacts-for-dm", verifyJwt, contactController.getContactsForDMList);
router.get("/get-all-contacts", verifyJwt, contactController.getAllContacts);

module.exports = router;
