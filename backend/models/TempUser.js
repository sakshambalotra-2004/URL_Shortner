const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otpHash: String,
  otpExpiry: Date,
});

module.exports = mongoose.model("TempUser", tempUserSchema);
