const express = require("express");
const { updateProfile, updateAnyProfile, changePassword } = require("../controllers/profileController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/update-profile", authenticate, updateProfile);
router.put("/update-any-profile", updateAnyProfile);
router.put("/change-password", authenticate, changePassword);

module.exports = router;
