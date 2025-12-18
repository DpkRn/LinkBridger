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
const User=require('./model/userModel')
const profileRoute=require('./routes/ProfileRoute')
const { extractInfo } = require('./middleware/deviceInfo')
const { sendVisitEmail } = require('./lib/mail')


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
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = [
  'https://clickly.cv',
  'https://www.clickly.cv',
  'https://linkbriger.vercel.app', 
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.options('*', cors());

app.use(cookieParser());
app.use(express.json({limit:'100mb'}))
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://vercel.live", "https://*.vercel.app"],  // Allow Vercel scripts
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],  // Add your image host if needed
    styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles if needed
    connectSrc: ["'self'", "https://clickly.cv","https://clickly.cv/*"],  // Add your API backend here
    // Add more directives as needed
  }
}));



app.get('/',(req,res)=>{
  console.log("redirecting to frontend")
  return res.redirect(307,"https://clickly.cv/app/")
})

app.use('/auth',authRoute)
app.use('/source',linkRoute)
app.use('/profile',profileRoute)


app.get('/:username',extractInfo, async (req, res) => {
  console.log("backend profile search start")
  const username=req.params.username
  const tree=await Link.find({username:username})
  const dp=await Profile.findOne({username},{image:1,bio:1});

  const info=await User.findOne({username},{email:1,name:1})
  if(!info){
    return res.render('not_exists')
  }
  const {email,name}=info
  const deviceDetails=req.details
  sendVisitEmail(email,username,name,deviceDetails,"LinkHub")

  if(tree&&dp){
    return res.render('linktree',{ 
      username:username,
      tree:tree,
      dp:dp 
    })   
  }
  
  return res.render('not_exists')
})


app.get('/:username/:source',extractInfo, async (req, res) => {
     

  const {username,source}=req.params;
  const linkHub=`Available link: ${req.protocol}://${req.get('host')}/${username}`

  const doc=await Link.findOne({username,source})

  const info=await User.findOne({username},{email:1,name:1})
  if(!info){
  return res.render('not_exists',{
    linkHub:""
  })
  }
  const {email,name}=info
  if(!doc) {
    return res.render('not_exists',{
    linkHub:linkHub
    })
  }
  // return res.status(404).json({success:false,message:`${source} not has been added for this user !`})

  const {destination,clicked,notSeen}=doc
  await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})

  const deviceDetails=req.details
  sendVisitEmail(email,username,name,deviceDetails,source)
  return res.redirect(307,destination)
})


mongoose.connect(db_url).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app http://localhost:${process.env.PORT}`)
})