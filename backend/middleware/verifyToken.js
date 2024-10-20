const jwt = require("jsonwebtoken");
const bcryptjs=require('bcryptjs')
const Otp = require("../model/otpModel");
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token)

    if (!token) {
      return res
        .status(401)
        .json({ success: false,message:"token expired !" });
    }
    console.log('verifing')
    const auth = await jwt.verify(token, process.env.JWT_KEY);
    if (auth) {
      console.log(auth);
      req.userId = auth.id;
      return next();
    }
    return res
      .status(401)
      .json({ success: false, message: "user unauthenticated !" });
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Session expired, please log in again." });
    }
    
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};
const otpVerify = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });

  try {
    // Find the OTP record for the given email
    console.log('d')
    const otpRecord = await Otp.findOne({ email });
    console.log('d')
    if (!otpRecord) {
      console.log('d')
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    console.log(otpRecord)

    // Compare the provided OTP with the hashed OTP in the database
   
    const isMatch = await bcryptjs.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  
    // If OTP is valid, delete the OTP record to prevent reuse
    await Otp.deleteOne({ email });
  
    return next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { verifyToken, otpVerify };
