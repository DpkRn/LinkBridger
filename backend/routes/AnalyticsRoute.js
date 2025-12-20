const { getAnalytics } = require('../controller/AnalyticsController');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();

router.post('/get', verifyToken, getAnalytics);

module.exports = router;

