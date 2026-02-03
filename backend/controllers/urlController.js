const Url = require("../models/Url");
const { nanoid } = require("nanoid");

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, expiryMinutes } = req.body;

    const shortId = nanoid(6);

    const expiresAt =
      expiryMinutes && expiryMinutes > 0
        ? new Date(Date.now() + expiryMinutes * 60000)
        : null;

    const url = await Url.create({
      originalUrl,
      shortId,
      expiresAt,
      user: req.user.id,
    });

    res.json({
      shortUrl: `http://localhost:5000/api/url/${shortId}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });

    if (!url) return res.status(404).send("URL not found");

    if (url.expiresAt && url.expiresAt < new Date())
      return res.status(410).send("Link expired");

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getUserUrls = async (req, res) => {
  const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(urls);
};
