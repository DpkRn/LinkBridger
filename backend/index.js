const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const path =require('path')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet'); 
const cloudinary = require('cloudinary')


const authRoute=require('./routes/AuthRoute')
const linkRoute=require('./routes/LinkRoute')
const Link = require('./model/linkModel')
const Profile=require('./model/userProfile')
const profileRoute=require('./routes/ProfileRoute')


dotenv.config()
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const app = express()
const port = process.env.PORT || 8080
const db_url=process.env.DATABASE_URL;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('Views directory:', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin:['https://linkbriger.vercel.app','http://localhost:5173'],
  methods:['POST','GET'],
  credentials:true
}))

app.use(cookieParser());
app.use(express.json({limit:'100mb'}))
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://vercel.live", "https://*.vercel.app"],  // Allow Vercel scripts
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],  // Add your image host if needed
    styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles if needed
    connectSrc: ["'self'", "https://linkb-one.vercel.app","https://linkb-one.vercel.app/*"],  // Add your API backend here
    // Add more directives as needed
  }
}));


app.use('/auth',authRoute)
app.use('/source',linkRoute)
app.use('/profile',profileRoute)

app.get('/',(req,res)=>{
  return res.send('welcome to my page: Dwizard')
})

app.get('/:username', async (req, res) => {
  const username=req.params.username
  const tree=await Link.find({username:username})
  const dp=await Profile.findOne({username},{image:1,bio:1});
  if(tree&&dp){
    console.log(tree)
    console.log(dp)
    return res.render('linktree',{ 
      username:username,
      tree:tree,
      dp:dp 
    })   
  }
  return res.render('not_exists')
})
app.get('/:username/:source', async (req, res) => {
     const {username,source}=req.params;
     const doc=await Link.findOne({username,source})
     if(!doc) return res.status(404).json({success:false,message:`${source} not has been added for this user !`})
    
     const {destination,clicked,notSeen}=doc
     await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})
     console.log(notSeen)
     return res.redirect(307,destination)
})

mongoose.connect(db_url).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app "http://localhost:8080"`)
})