const express = require('express');
const documentRoutes = require('./document.routes');
const recommendationRoutes = require('./recommendation.routes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'document-analysis-service' });
});

// API routes
router.use('/documents', documentRoutes);
router.use('/recommendations', recommendationRoutes);

module.exports = router; 