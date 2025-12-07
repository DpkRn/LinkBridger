const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },  // We will hash this OTP before storing it
  createdAt: { type: Date, default: Date.now, expires: 300 },  // OTP expires after 5 minutes
});
const Otp=mongoose.model('Otp', otpSchema);
module.exports = Otp