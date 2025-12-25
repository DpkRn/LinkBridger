const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true // Allows multiple null values
    },
    password:{
        type:String,
        required:false // Made optional for OAuth users
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    picture:{
        type:String,
        default:null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
})

const User=mongoose.model('user',userSchema)
module.exports=User