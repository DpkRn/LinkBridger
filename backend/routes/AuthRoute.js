const { deviceLogin, getDeviceInfo, signOut, checkAvailablity, sendOtp, changePassword } = require('../controller/AuthController');
const { verifyToken, otpVerify } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/signup', sendOtp)
router.post('/signin', deviceLogin)
router.post('/checkavailablity', checkAvailablity)
router.post('/verify', verifyToken, getDeviceInfo)
router.get('/signout', signOut)

router.post('/password_reset', sendOtp)
router.post('/validate_otp', otpVerify, changePassword)

module.exports=router
