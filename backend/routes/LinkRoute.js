const { addNewSource, getAllSource } = require('../controller/LinkController');
const { verifyToken } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/addnewsource',addNewSource)
router.post('/getallsource',getAllSource)

// router.get('/verify',verifyToken,getUserInfo)

module.exports=router