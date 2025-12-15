const { addNewSource, getAllSource,deleteLink,setNotificationToZero,editLink } = require('../controller/LinkController');
const { verifyToken } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/addnewsource',verifyToken,addNewSource)
router.post('/getallsource',verifyToken,getAllSource)
router.post('/deletelink',verifyToken,deleteLink)
router.post('/editlink',verifyToken,editLink)
router.post('/notifications',verifyToken,setNotificationToZero)

// router.get('/verify',verifyToken,getUserInfo)

module.exports=router