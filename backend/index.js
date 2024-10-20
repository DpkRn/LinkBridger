const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const path =require('path')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet'); 


const authRoute=require('./routes/AuthRoute')
const linkRoute=require('./routes/LinkRoute')
const Link = require('./model/linkModel')


dotenv.config()
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
app.use(express.json())
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://vercel.live", "https://*.vercel.app"],  // Allow Vercel scripts
    imgSrc: ["'self'", "data:", "https://your-image-host.com"],  // Add your image host if needed
    styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles if needed
    connectSrc: ["'self'", "https://linkb-one.vercel.app","https://linkb-one.vercel.app/*"],  // Add your API backend here
    // Add more directives as needed
  }
}));


app.use('/auth',authRoute)
app.use('/source',linkRoute)

app.get('/',(req,res)=>{
  return res.send('welcome to my page: Dwizard')
})

app.get('/:username', async (req, res) => {
  const username=req.params.username
  const tree=await Link.find({username:username})
  if(tree){
    console.log(tree)
    return res.render('linktree.ejs',{ 
      username:username,
      tree:tree 
    })   
  }
  return res.render('not exists')
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