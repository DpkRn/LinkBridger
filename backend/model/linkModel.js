const mongoose=require('mongoose')
const linkSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
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