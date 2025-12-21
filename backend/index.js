const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const path =require('path')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet'); 
const cloudinary = require('cloudinary')
const crypto = require('crypto')

const authRoute=require('./routes/AuthRoute')
const linkRoute=require('./routes/LinkRoute')
const analyticsRoute=require('./routes/AnalyticsRoute')

const Link = require('./model/linkModel')
const Profile=require('./model/userProfile')
const User=require('./model/userModel')
const UserSettings=require('./model/userSettingsModel')
const profileRoute=require('./routes/ProfileRoute')
const { extractInfo } = require('./middleware/deviceInfo')
const { sendVisitEmail } = require('./lib/mail')
const bcryptjs = require('bcryptjs')


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
  'http://localhost:5173',
  'http://localhost:8080'
];

console.log("tier=",process.env.TIER)

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
app.use(express.urlencoded({ extended: true, limit: '100mb' })) // For form submissions
// Configure helmet with iframe support for preview
app.use(helmet({
  frameguard: {
    action: 'sameorigin' // Allow iframes from same origin, but we'll override for preview
  }
}));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://vercel.live", "https://*.vercel.app"],  // Allow inline scripts for EJS templates
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],  // Add your image host if needed
    styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles if needed
    connectSrc: ["'self'", "https://clickly.cv","https://clickly.cv/*", "http://localhost:8080"],  // Add your API backend here
    frameAncestors: ["'self'", "http://localhost:5173", "https://clickly.cv", "https://linkbriger.vercel.app"],  // Allow iframes from these origins
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
app.use('/settings',require('./routes/SettingsRoute'))
app.use('/search',require('./routes/SearchRoute'))
app.use('/analytics',analyticsRoute)
app.use('/project',require('./routes/ProjectRoute'))

// Helper function to encode username and source (base64)
const encodeData = (data) => {
  return Buffer.from(data).toString('base64');
};

// Helper function to decode username and source
const decodeData = (encodedData) => {
  try {
    return Buffer.from(encodedData, 'base64').toString('utf8');
  } catch (error) {
    return null;
  }
};





// Handle password submission for private links
app.post('/link/verify-password', extractInfo, async (req, res) => {
  const { hashedUsername, hashedSource, password } = req.body;

  const username = decodeData(hashedUsername);
  const source = decodeData(hashedSource);
  console.log(password)

  const doc = await Link.findOne({
    username,
    source,
    deletedAt: null
  });

  if (!doc) {
    return res.status(404).json({ success: false });
  }

  //  const bcryptjs = require('bcryptjs');
    if (!doc.password || !(await bcryptjs.compare(password, doc.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }
  //   // Password correct, redirect directly to destination
    const {destination,clicked,notSeen}=doc
    await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})
    
    const info=await User.findOne({username},{email:1,name:1})
    if(info) {
      const {email,name}=info
      const deviceDetails=req.details || {}
      // Send email asynchronously, don't wait for it
      sendVisitEmail(email,username,name,deviceDetails,source).catch(err => {
        console.error(`Failed to send visit to ${username}:`, err);
      });
    }


  return res.json({
    success: true,
    destination: destination
  });
});




app.get('/:username/:source',extractInfo, async (req, res) => {
  const {username,source}=req.params;
  const linkHub=`Available link: ${req.protocol}://${req.get('host')}/${username}`

  const doc=await Link.findOne({
    username,
    source,
    deletedAt: null
  })

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

  // Check link visibility
  // private links should render password prompt page directly
  if(!doc.isAccessible()) {
    console.log("not accessible")
    // Encode username and source before sending to EJS
    const hashedUsername = encodeData(username);
    const hashedSource = encodeData(source);
    return res.render('password_prompt', { 
      hashedUsername:hashedUsername, 
      hashedSource:hashedSource,
      linkId:doc.linkId 
    });
  }

  // unlisted links are accessible via direct URL (password protection can be added later)
  // public links are accessible
  const {destination,clicked,notSeen}=doc
  await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})

  const deviceDetails=req.details
  sendVisitEmail(email,username,name,deviceDetails,source)
  return res.redirect(307,destination)
})

app.get('/:username',extractInfo, async (req, res) => {
  // Allow iframe embedding for preview (allow from frontend origins)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  const frontendOrigins = "http://localhost:5173 https://clickly.cv https://linkbriger.vercel.app 'self'";
  res.setHeader('Content-Security-Policy', `frame-ancestors ${frontendOrigins}`);
  
  console.log("backend profile search start")
  const username=req.params.username
  // Only show public links in linkhub - unlisted and private links should not appear
  const tree=await Link.find({
    username: username,
    visibility: 'public',
    deletedAt: null
  })
  const dp=await Profile.findOne({username},{image:1,bio:1});

  const info=await User.findOne({username},{email:1,name:1})
  if(!info){
    return res.render('not_exists')
  }
  const {email,name}=info
  const deviceDetails=req.details
  sendVisitEmail(email,username,name,deviceDetails,"LinkHub")

  if(tree&&dp){
    // Get user settings to determine template
    let template = 'default'; // Default template
    
    // Check if template query parameter is provided (for preview)
    const previewTemplate = req.query.template;
    if (previewTemplate) {
      template = previewTemplate;
    } else {
      // Otherwise, use user's saved template from settings
      try {
        const settings = await UserSettings.getUserSettings(username);
        if (settings && settings.template) {
          template = settings.template;
        }
      } catch (err) {
        console.log('Error fetching template settings, using default:', err.message);
      }
    }
    
    // Construct template name (templates/linktree-{template})
    const templateName = `templates/linktree-${template}`;
    console.log("templateName",templateName)
    // Render template, fallback to default if template doesn't exist
    try {
      return res.render(templateName,{ 
        username:username,
        tree:tree,
        dp:dp 
      });
    } catch (renderErr) {
      // If template doesn't exist, fallback to default
      console.log(`Template ${templateName} not found, using default:`, renderErr.message);
      return res.render('templates/linktree-default',{ 
        username:username,
        tree:tree,
        dp:dp 
      });
    }
  }
  
  return res.render('not_exists', { linkHub: '' })
})




mongoose.connect(db_url).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app http://localhost:${process.env.PORT}`)
})