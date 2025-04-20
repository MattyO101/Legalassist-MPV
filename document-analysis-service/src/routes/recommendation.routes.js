const express = require('express');
const recommendationController = require('../controllers/recommendation.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all recommendations for a document
router.get('/document/:documentId', recommendationController.getDocumentRecommendations);

// Apply a recommendation
router.post('/:id/apply', recommendationController.applyRecommendation);

// Reject a recommendation
router.post('/:id/reject', recommendationController.rejectRecommendation);

module.exports = router; 