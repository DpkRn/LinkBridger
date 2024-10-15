const Link = require("../model/linkModel");

const addNewSource=async(req,res)=>{
    try{
        // const userId=req.userId;
        console.log('adding')
       const {userId,username,source,destination}=req.body
        if(!userId||!source||!username||!destination){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
    
        const sourceExist=await Link.findOne({userId,username,source});
        if(sourceExist){
            return res.status(409).json({success:false,message:`${source} allready exists !`})
        }
        
        const doc=await Link.create({userId,username,source,destination})
       
        if(doc)
        return res.status(201).json({success:true,message:`${source} added !`,link:doc})

    }catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:"Server Internal Error !"})
    }
}


const getAllSource=async(req,res)=>{
    try{

        const {username}=req.body
         if(!username){
             return res.status(400).json({success:false,message:"username is required"})
         }
     
         const sources=await Link.find({username},{source:1,destination:1,clicked:1});
         if(!sources)
         return res.status(404).json({success:false,message:'sources not found !'})
         return res.status(200).json({success:true,message:'sources fetched successfully',sources})
 
     }catch(err){
         console.log(err)
         return res.status(500).json({success:false,message:"Server Internal Error"})
     }
    }
const deleteLink=async(req,res)=>{
    try{
       const id=req.body.id
       if(!id){
        return res.status(404).json({success:false,message:"link already deleted !"})
       }
     
         const link=await Link.findByIdAndDelete(id);
         if(!link)
         return res.status(404).json({success:false,message:'Not found!'})
         
         return res.status(200).json({success:true,message:"link has been deleted successfully"})
 
     }catch(err){
         console.log(err)
         return res.status(500).json({success:false,message:"Server Internal Error"})
     }
    }

module.exports={
    addNewSource,
    getAllSource,
    deleteLink
}