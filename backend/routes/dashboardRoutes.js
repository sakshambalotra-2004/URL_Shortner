const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getStats,
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  deleteAllUrls,
  deleteAccount,
} = require("../controllers/dashboardController");

// Dashboard stats
router.get("/stats", auth, getStats);

// User profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, changePassword);

// Settings routes
router.get("/settings", auth, getSettings);
router.put("/settings", auth, updateSettings);

// Danger zone routes
router.delete("/urls/all", auth, deleteAllUrls);
router.delete("/account", auth, deleteAccount);

module.exports = router;
