const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpVerification, sendWelcomeEmail, sendNewUserOnboardingEmail } = require("../lib/mail");
const Profile=require('../model/userProfile')
const Otp = require("../model/otpModel");

function generateOTP() {
  let otp = Math.floor(1000 + Math.random() * 9000);
  otp = JSON.stringify(otp);
  console.log(otp)
  return otp;
}
const signUpController = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (username.length < 5) {
      return res.status(400).json({
        success: false,
        message: "username should be atleast 5 character length !",
      });
    }

    
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ success: false, message: "user allready exists !" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    const userinfo=await Profile.create({username,image:"/images/panda.png"});
    if (user&&userinfo) {
      console.log("user created");
      // Use name from request body or fallback to username
      const displayName = name || username;
      sendWelcomeEmail(email, username, displayName, "LinkBridger");
      sendNewUserOnboardingEmail(email, username, displayName, "LinkBridger");
      return res
        .status(201)
        .json({ success: true, message: "user registerd !", user });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const signInController = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).lean();
    console.log("user",user)
    
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email does not exist !" });
    const auth = await bcryptjs.compare(password, user.password);
    if (!auth) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials !" });
    }
    const token = jwt.sign(
      { email: email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    delete user.password
    return res
      .status(200)
      .json({ success: true, message: "Login successfull", user });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const checkAvailablity = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);

    const userExist = await User.findOne({ username });
    if (userExist) {
      return res
        .status(209)
        .json({ success: true, message: "username exists !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "username not exists !" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error !" });
  }
};

const signOut = async (req, res) => {
  try {
    //  const token=jwt.sign({email:email,id:user._id},process.env.JWT_KEY,{expiresIn:'24h'})
    res.cookie("token", "", {
      expires: new Date(0),
      sameSite: "None",
      secure: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged Out successfull" });
  } catch (err) {


    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const id = req.userId;

    // Find user by ID and return a plain JavaScript object
    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Remove the password field from the user object
    delete user.password;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  let { username } = req.body || "";
  if (!username) username = " ";
  console.log("sending otp");
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const otp = generateOTP();

    const hashedOtp = await bcryptjs.hash(otp, 10);

    // Save the hashed OTP in the database
    sendOtpVerification(otp, email, username, "Link Bridge");
    const isAvailable = await Otp.findOne({ email });
    if (isAvailable) {
      const isOtp = await Otp.updateOne(
        { email },
        { $set: { otp: hashedOtp, createdAt: Date.now() } }
      );
      if (isOtp) {
        return res
          .status(201)
          .json({ success: true, message: `Otp has been sent to ${email}` });
      }
    } else {
      const isOtp = await Otp.create({ otp: hashedOtp, email });
      if (isOtp) {
        return res
          .status(201)
          .json({ success: true, message: `Otp has been sent to ${email}` });
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

const changePassword = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Fields Required" });

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Save the hashed OTP in the database

    const isChanged = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (isChanged) {
      return res
        .status(201)
        .json({ success: true, message: `Password Reset Successfully` });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Internal Error" });
  }
};

module.exports = {
  signUpController,
  signInController,
  getUserInfo,
  signOut,
  checkAvailablity,
  sendOtp,
  changePassword,
};
