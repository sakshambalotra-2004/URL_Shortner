const User = require("../models/User");
const TempUser = require("../models/TempUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ---------- EMAIL ----------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ---------- OTP ----------
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ================= SIGNUP (SEND OTP) =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Already registered?
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Remove old OTPs
    await TempUser.deleteOne({ email });

    // Save temp user
    await TempUser.create({
      name,
      email,
      password: hashedPassword,
      otpHash,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min
    });

    // Send OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });


    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ error: "Invalid request" });
    }

    if (tempUser.otpExpiry < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== tempUser.otpHash) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Create actual user
    await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    await TempUser.deleteOne({ email });

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ================= LOGIN (PASSWORD) =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN BODY:", req.body);

    const user = await User.findOne({ email });
    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
