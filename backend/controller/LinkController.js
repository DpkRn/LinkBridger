const Link = require("../model/linkModel");

const addNewSource=async(req,res)=>{
    try{
         const userId=req.userId;
        console.log(userId)
       const {username,source,destination}=req.body
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
        console.log(err,"error")
        return res.status(500).json({success:false,message:"Server Internal Erro !"})
    }
}


const getAllSource=async(req,res)=>{
    try{
        const userId=req.userId;
        const {username}=req.body
         if(!userId||!username){
             return res.status(400).json({success:false,message:"looks like you entered link directely ! please login first"})
         }
     
         const sources=await Link.find({username,userId},{source:1,destination:1,clicked:1,notSeen:1});
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

    const editLink=async(req,res)=>{
        try{
            if(!req.userId){
                return res.status(401).json({success:false,message:"Login first. token expired !"})
            }
            const {id, source, destination} = req.body;
            if(!id){
                return res.status(400).json({success:false,message:"Link ID is required"})
            }
            
            const link = await Link.findById(id);
            if(!link){
                return res.status(404).json({success:false,message:"Link not found!"})
            }
            
            // Verify the link belongs to the user
            if(link.userId.toString() !== req.userId.toString()){
                return res.status(403).json({success:false,message:"You don't have permission to edit this link"})
            }
            
            // If source is being changed, check for duplicates (excluding current link)
            if(source && source !== link.source){
                const sourceExist = await Link.findOne({
                    userId: req.userId,
                    username: link.username,
                    source: source,
                    _id: { $ne: id } // Exclude the current link being edited
                });
                
                if(sourceExist){
                    return res.status(409).json({success:false,message:`${source} already exists! Please choose a different platform name.`})
                }
            }
            
            // Update the link
            const updateData = {};
            if(source) updateData.source = source;
            if(destination) updateData.destination = destination;
            
            const updatedLink = await Link.findByIdAndUpdate(
                id,
                {$set: updateData},
                {new: true}
            );
            
            return res.status(200).json({
                success:true,
                message:"Link has been updated successfully",
                link:updatedLink
            })
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
    editLink,
}