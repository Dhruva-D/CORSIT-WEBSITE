const express = require("express");
const { registerMember, setPassword, loginMember } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerMember);
router.post("/set-password", setPassword);
router.post("/login", loginMember);

module.exports = router;
