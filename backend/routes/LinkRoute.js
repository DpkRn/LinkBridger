const { addNewSource, getAllSource,deleteLink } = require('../controller/LinkController');
const { verifyToken } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/addnewsource',addNewSource)
router.post('/getallsource',getAllSource)
router.post('/deletelink',deleteLink)

// router.get('/verify',verifyToken,getUserInfo)

module.exports=router