const route = require('express').Router();
const { searchUsers } = require('../controller/SearchController');

// Search doesn't require authentication (public search)
route.post('/users', searchUsers);

module.exports = route;
