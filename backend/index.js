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
const { sendNotificationEmail } = require('./lib/mail')


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
// console.log('Views directory:', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = [
  'https://clickly.cv',
  'https://www.clickly.cv',
  'https://linkbriger.vercel.app' // if your frontend ever runs directly on Vercel
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

// Optional: explicitly handle OPTIONS for all routes
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
    connectSrc: ["'self'", "https://linkb-one.vercel.app","https://linkb-one.vercel.app/*","https://clickly.cv/*"],  // Add your API backend here
    // Add more directives as needed
  }
}));



app.get('/',(req,res)=>{
  return res.redirect(307,"https://clickly.cv/app/")
})

app.use('/auth',authRoute)
app.use('/source',linkRoute)
app.use('/profile',profileRoute)


const normalizeUsername = u => (u ? String(u).trim() : '');

app.get('/:username', extractInfo, async (req, res) => {
  try {
    const usernameRaw = req.params.username;
    const username = normalizeUsername(usernameRaw);
    console.log('GET /:username - raw:', JSON.stringify(usernameRaw), 'normalized:', username);

    const [tree, dp, user] = await Promise.all([
      Link.find({ username }).lean(),
      Profile.findOne({ username }, { image: 1, bio: 1 }).lean(),
      User.findOne({ username }, { email: 1, name: 1 }).lean()
    ]);

    if (!user) {
      console.warn(`No user record found for username="${username}"`);
      // decide what’s correct in your app: render not_exists or continue without email
      return res.render('not_exists');
    }

    // send email only if email exists
    if (user.email) {
      try {
        await sendNotificationEmail(user.email, username, user.name, req.details || {}, 'LinkHub');
      } catch (mailErr) {
        console.error('sendNotificationEmail failed:', mailErr);
      }
    } else {
      console.warn(`User ${username} has no email; skipping notification`);
    }

    if (tree && dp) {
      return res.render('linktree', { username, tree, dp });
    }
    return res.render('not_exists');

  } catch (err) {
    console.error('Error in GET /:username route:', err);
    return res.status(500).send('Internal server error');
  }
});

app.get('/:username/:source', extractInfo, async (req, res) => {
  try {
    const username = normalizeUsername(req.params.username);
    const { source } = req.params;
    console.log('GET /:username/:source', { username, source });

    const [doc, user] = await Promise.all([
      Link.findOne({ username, source }).lean(),
      User.findOne({ username }, { email: 1, name: 1 }).lean()
    ]);

    if (!doc) {
      return res.status(404).json({ success: false, message: `${source} has not been added for this user!` });
    }

    await Link.updateOne({ username, source }, { $inc: { clicked: 1, notSeen: 1 } });

    if (user && user.email) {
      try {
        await sendNotificationEmail(user.email, username, user.name, req.details || {}, source);
      } catch (mailErr) {
        console.error('sendNotificationEmail failed:', mailErr);
      }
    } else {
      console.warn(`No email to send for username=${username}`);
    }

    return res.redirect(307, doc.destination);
  } catch (err) {
    console.error('Error in GET /:username/:source route:', err);
    return res.status(500).send('Internal server error');
  }
});



mongoose.connect(db_url).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app http://localhost:${process.env.PORT}`)
})