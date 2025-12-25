const router=require('express').Router();
const { extractInfo } = require('../middleware/deviceInfo');
const { verifyTokenOptional } = require('../middleware/verifyToken');
const {
  verifyPassword,
  getLinkByUsernameAndSource,
  getProfileByUsername
} = require('../controller/LinkBridgerController');

// Handle password submission for private links
router.post('/link/verify-password', extractInfo, verifyPassword);

// Handle link access by username and source
router.get('/:username/:source', extractInfo, getLinkByUsernameAndSource);

// Handle profile page by username
router.get('/:username', extractInfo, verifyTokenOptional, getProfileByUsername);

module.exports=router