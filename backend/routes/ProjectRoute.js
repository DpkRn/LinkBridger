const route = require('express').Router();
const { getAvailableTemplates, getAllTemplates } = require('../controller/ProjectController');
const { verifyToken } = require('../middleware/verifyToken');

// Public route - anyone can see available templates
route.get('/templates', getAvailableTemplates);

// Protected route - admin can see all templates (including disabled)
// route.get('/templates/all', verifyToken, getAllTemplates);

module.exports = route;

