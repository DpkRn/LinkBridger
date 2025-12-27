const { getAnalytics, getClickDetails, getClickDetailsV1 } = require('../controller/AnalyticsController');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();

router.post('/get', verifyToken, getAnalytics);
router.post('/click-details', verifyToken, getClickDetails);
router.post('/click-details-v1', verifyToken, getClickDetailsV1);

module.exports = router;

