const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const mongoose=require('mongoose')
const dotenv = require('dotenv')


const authRoute=require('./routes/AuthRoute')
const linkRoute=require('./routes/LinkRoute')
const Link = require('./model/linkModel')


dotenv.config()
const app = express()
const port = process.env.PORT || 8080
const db_url=process.env.DATABASE_URL;


app.use(cors({
  origin:['http://localhost:5173'],
  methods:['POST','GET'],
  credentials:true
}))

app.use(cookieParser());
app.use(express.json())



app.use('/auth',authRoute)
app.use('/source',linkRoute)
app.get('/',(req,res)=>{
  return res.send('welcome to my page: Dwizard')
})

app.get('/:username/:source', async (req, res) => {
     const {username,source}=req.params;
     const doc=await Link.findOne({username,source})
     if(!doc) return res.status(404).json({success:false,message:`${source} not has been added for this user !`})
    
     const {destination,clicked}=doc
     await Link.updateOne({username,source},{$set:{clicked:clicked+1}})
     return res.redirect(307,destination)
})

mongoose.connect(db_url).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app "http://localhost:8080"`)
})