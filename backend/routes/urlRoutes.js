const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createShortUrl,
  redirectUrl,
  getUserUrls,
} = require("../controllers/urlController");

router.post("/shorten", auth, createShortUrl);
router.get("/my-urls", auth, getUserUrls);
router.get("/:shortId", redirectUrl);

module.exports = router;
