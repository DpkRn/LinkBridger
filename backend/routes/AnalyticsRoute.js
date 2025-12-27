const { getAnalytics, getClickDetails } = require('../controller/AnalyticsController');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();

router.post('/get', verifyToken, getAnalytics);
router.post('/click-details', verifyToken, getClickDetails);

module.exports = router;

