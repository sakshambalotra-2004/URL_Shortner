const Url = require("../models/Url");

exports.getStats = async (req, res) => {
  const urls = await Url.find({ user: req.userId });

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  const mostClicked = urls.sort((a, b) => b.clicks - a.clicks)[0];

  res.json({
    totalLinks,
    totalClicks,
    mostClicked
  });
};
