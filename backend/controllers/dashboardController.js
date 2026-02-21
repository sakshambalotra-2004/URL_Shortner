const User = require("../models/User");
const Url = require("../models/Url");

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user's URLs
    const urls = await Url.find({ userId });

    // Calculate statistics
    const totalLinks = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const mostClicked = urls.length > 0 
      ? Math.max(...urls.map((url) => url.clicks)) 
      : 0;
    const avgClicks = totalLinks > 0 
      ? (totalClicks / totalLinks).toFixed(1) 
      : 0;

    // Get active (non-expired) links
    const now = new Date();
    const activeLinks = urls.filter(
      (url) => !url.expiresAt || new Date(url.expiresAt) > now
    ).length;

    // Get clicks in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentClicks = urls.reduce((sum, url) => {
      // This assumes you track click timestamps - adjust based on your schema
      return sum + (url.clicks || 0);
    }, 0);

    res.json({
      totalLinks,
      totalClicks,
      mostClicked,
      avgClicks: parseFloat(avgClicks),
      activeLinks,
      recentClicks,
      urls: urls.map(url => ({
        _id: url._id,
        shortId: url.shortId,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's URL stats
    const urls = await Url.find({ userId });
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      totalLinks: urls.length,
      totalClicks,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Validate input
    if (!name && !email) {
      return res.status(400).json({ error: "Please provide name or email to update" });
    }

    // Check if email already exists (if changing email)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("settings");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Default settings if none exist
    const defaultSettings = {
      emailNotifications: true,
      clickNotifications: false,
      expiryReminders: true,
      weeklyReport: false,
      autoDelete: true,
      defaultExpiry: 60,
      qrCodeSize: "medium",
      analyticsTracking: true,
    };

    res.json(user.settings || defaultSettings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { settings },
      { new: true, runValidators: true }
    ).select("settings");

    res.json({
      message: "Settings updated successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

// Delete all user URLs
exports.deleteAllUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Url.deleteMany({ userId });

    res.json({
      message: "All URLs deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete all URLs error:", error);
    res.status(500).json({ error: "Failed to delete URLs" });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all user's URLs
    await Url.deleteMany({ userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};