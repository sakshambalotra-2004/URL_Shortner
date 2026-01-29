const Url = require("../models/Url");
const { nanoid } = require("nanoid");

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortId = nanoid(6);
    const newUrl = await Url.create({ originalUrl, shortId });

    res.json({
      shortUrl: `http://localhost:5000/api/url/${shortId}`,
      shortId: shortId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } }
    );

    if (!url) return res.status(404).send("URL not found");

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
