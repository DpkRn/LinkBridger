const route=require('express').Router();
const {updateProfile,getProfile, updateProfilePic, getPublicProfile}=require('../controller/ProfileController')
const { verifyToken, verifyTokenOptional } = require('../middleware/verifyToken');

route.post('/update',updateProfile)
route.post('/getprofileinfo',getProfile)
route.post('/updatepic',updateProfilePic)
// Public route - allows optional authentication
// verifyTokenOptional sets req.userId if user is logged in, otherwise null
// Allows public viewing of profiles, but owners can preview their own private profiles
// All content respects permissions from settings, even for owners
route.post('/getpublicprofile', verifyTokenOptional, getPublicProfile)

module.exports=route