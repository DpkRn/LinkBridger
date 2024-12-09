const route=require('express').Router();
const {updateProfile,getProfile, updateProfilePic}=require('../controller/ProfileController')

route.post('/update',updateProfile)
route.post('/getprofileinfo',getProfile)
route.post('/updatepic',updateProfilePic)

module.exports=route