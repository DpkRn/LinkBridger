const { signUpController, signInController, getUserInfo ,signOut,checkAvailablity,sendOtp,changePassword,resendOtp} = require('../controller/AuthController');
const { verifyToken, otpVerify } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/signup',sendOtp)
router.post('/signin',signInController)
router.post('/checkavailablity',checkAvailablity)
router.post('/verify',verifyToken,getUserInfo)
router.post('/verifyacc',otpVerify,signUpController)
router.get('/signout',signOut)


router.post('/password_reset',sendOtp)
// router.post('/resend_otp',resendOtp)
router.post('/validate_otp',otpVerify,changePassword)

module.exports=router
