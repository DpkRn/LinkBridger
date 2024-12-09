const mongoose=require('mongoose')
const userProfileSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true    
    },
    name:{
        type:String,
        default:""
    },
    passion:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    image:{
        type:String,
        defalut:"profile.jpg"
    }

},{timestamps:true})

const User=mongoose.model('userinfo',userProfileSchema)
module.exports=User;