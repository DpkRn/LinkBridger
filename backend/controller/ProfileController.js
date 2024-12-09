const Profile = require("../model/userProfile");
const cloudinary = require('cloudinary')
const updateProfile = async (req, res) => {
    let { username, name, location, bio, passion } = req.body;
    console.log(name, location, bio, passion);
  
    // Ensure fields are set to empty strings if undefined
    if (!name) name = "";
    if (!bio) bio = ""; 
    if (!passion) passion = ""; 
    if (!location) location = ""; 
  
    try {
      // Update the profile and fetch the updated document
      const updatedProfile = await Profile.findOneAndUpdate(
        { username }, // Filter by username
        { $set: { name, bio, passion, location } }, // Fields to update
        { new: true } // Return the updated document
      );
  
      if (updatedProfile) {
        return res.status(201).json({
          success: true,
          msg: "Profile updated successfully!",
          info: updatedProfile, // Return the updated profile
        });
      } else {
        return res.status(404).json({
          success: false,
          msg: "User not found!",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Server internal error!",
      });
    }
  };

  const getProfile=async(req,res)=>{
    const {username}=req.body
    console.log(username)
    try{
        const userinfo=await Profile.findOne({username});
        if(userinfo){
            return res.status(200).json({success:true,msg:"user found !",userinfo});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,msg:"Server Internal Error"})
    }
  }

  const updateProfilePic=async(req,res)=>{
    let { image,username } = req.body;
   if(!image) return res.status(400).json({success:false,msg:"Image uploading failed ! try again."})


   try{
    console.log("uploading image")
    const result=await cloudinary.v2.uploader.upload(image,{folder:"linkbrige-Profile"})
    console.log("uploaded image")
    const imgUrl=result.secure_url || "profile.jpg";
    console.log(imgUrl)
    try {
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { username }, // Filter by username
        { $set: { image:imgUrl } }, // Fields to update
        { new: true } // Return the updated document
      );
  
      if (updatedProfile) {
        return res.status(201).json({
          success: true,
          msg: "Profile picture updated successfully!",
          resImage: imgUrl, // Return the updated profile
        });
      } else {
        return res.status(404).json({
          success: false,
          msg: "User not found!",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Server internal error!",
      });
    }
   }catch(err){
    console.log(err)
        return res.status(500).json({success:false,msg:"image uploading failed! try again"})
   }
  }

module.exports = {
    updateProfile,
    getProfile,
    updateProfilePic
};
