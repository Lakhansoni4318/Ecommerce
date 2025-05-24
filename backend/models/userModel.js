const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["User", "Seller"],
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpiration: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phone: { type: String },
  address: { type: String },
});

module.exports = mongoose.model("User", userSchema);
