const mongoose=require('mongoose')
const linkSchema=mongoose.Schema({
    // username is kept for backward compatibility but is optional now.
    username:{
        type:String,
        required:false,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    notSeen:{
        type:Number,
        default:0
    },
    clicked:{
        type:Number,
        default:0
    }
})

const Link=mongoose.model('link',linkSchema)
module.exports=Link