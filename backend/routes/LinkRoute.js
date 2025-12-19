const { addNewSource, getAllSource,deleteLink,setNotificationToZero,editLink, updateVisibility } = require('../controller/LinkController');
const { verifyToken } = require('../middleware/verifyToken');

const router=require('express').Router();



router.post('/addnewsource',verifyToken,addNewSource)
router.post('/getallsource',verifyToken,getAllSource)
router.post('/deletelink',verifyToken,deleteLink)
router.post('/editlink',verifyToken,editLink)
router.post('/notifications',verifyToken,setNotificationToZero)
router.post('/updatevisibility',verifyToken,updateVisibility)

module.exports=router