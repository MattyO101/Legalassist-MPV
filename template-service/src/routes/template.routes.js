const express = require('express');
const templateController = require('../controllers/template.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes - for MVP, we'll allow access to templates without authentication
router.get('/', templateController.getTemplates);
router.get('/categories', templateController.getTemplateCategories);
router.get('/:id', templateController.getTemplate);

// Protected routes
router.post('/:id/customize', auth, templateController.customizeTemplate);
router.post('/:id/export', auth, templateController.exportTemplate);
router.get('/user/templates', auth, templateController.getUserTemplates);
router.post('/user/templates', auth, templateController.saveUserTemplate);
router.delete('/user/templates/:id', auth, templateController.deleteUserTemplate);

module.exports = router; 