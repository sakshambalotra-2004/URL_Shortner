const Url = require("../models/Url");
const { nanoid } = require("nanoid");

/**
 * Create Short URL
 * Expiry is OPTIONAL
 */
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, expiryMinutes } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortId = nanoid(6);

    // ✅ OPTIONAL expiry logic
    const expiresAt =
      expiryMinutes && Number(expiryMinutes) > 0
        ? new Date(Date.now() + expiryMinutes * 60 * 1000)
        : null;

    const newUrl = await Url.create({
      originalUrl,
      shortId,
      expiresAt
    });

    res.json({
      shortUrl: `http://localhost:5000/api/url/${shortId}`,
      shortId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Redirect Short URL
 * Handles optional expiry + clicks
 */
exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).send("URL not found");
    }

    // ✅ Check expiry ONLY if it exists
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).send("❌ QR Code / URL Expired");
    }

    // Increment clicks
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
