const Link = require("../model/linkModel");

const addNewSource=async(req,res)=>{
    try{
         const userId=req.userId;
        console.log(userId)
       const {source,destination}=req.body;
        if(!userId||!source||!destination){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
    
        const sourceExist=await Link.findOne({userId,source});
        if(sourceExist){
            return res.status(409).json({success:false,message:`${source} allready exists !`})
        }
        
        const doc=await Link.create({userId,source,destination})
       
        if(doc)
        return res.status(201).json({success:true,message:`${source} added !`,link:doc})

    }catch(err){
        console.log(err,"error")
        return res.status(500).json({success:false,message:"Server Internal Erro !"})
    }
}


const getAllSource=async(req,res)=>{
    try{
        const userId=req.userId;
        if(!userId){
            return res.status(400).json({success:false,message:"looks like you entered link directly ! please login first"})
        }

         const sources=await Link.find({userId},{source:1,destination:1,clicked:1,notSeen:1});
         if(!sources)
         return res.status(404).json({success:false,message:'sources not found !'})
         return res.status(200).json({success:true,message:'sources fetched successfully',sources})
 
     }catch(err){
         console.log(err,"error")
         return res.status(500).json({success:false,message:"Server Internal Error"})
     }
    }
const deleteLink=async(req,res)=>{
    try{
        if(!req.userId){
            return res.status(404).json({success:false,message:"Login first. token expired !"})
        }
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

    const setNotificationToZero=async(req,res)=>{
        try{
            const userId=req.userId;
            console.log('updating')
            await Link.updateMany({userId},{$set:{notSeen:0}});
            return res.status(201).json({success:true})
        }catch(err){
            console.log(err);
            return res.status(500).json({success:false,message:"Server Internal Error"})
        }
    }

module.exports={
    addNewSource,
    getAllSource,
    deleteLink,
    setNotificationToZero,
}