const { singUpController, singInController, getUserInfo ,signOut,checkAvailablity,sendOtp,changePassword,resendOtp} = require('../controller/AuthController');
const { verifyToken, otpVerify } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/signup',sendOtp)
router.post('/signin',singInController)
router.post('/checkavailablity',checkAvailablity)
router.get('/verify',verifyToken,getUserInfo)
router.post('/verifyacc',otpVerify,singUpController)
router.get('/signout',signOut)


router.post('/password_reset',sendOtp)
// router.post('/resend_otp',resendOtp)
router.post('/validate_otp',otpVerify,changePassword)

module.exports=router
