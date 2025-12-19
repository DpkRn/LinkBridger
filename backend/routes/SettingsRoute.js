const route = require('express').Router();
const { getSettings, updateSettings } = require('../controller/SettingsController');
const { verifyToken } = require('../middleware/verifyToken');

route.post('/get', verifyToken, getSettings);
route.post('/update', verifyToken, updateSettings);

module.exports = route;
