const express = require('express');
const templateRoutes = require('./template.routes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'template-service' });
});

// API routes
router.use('/templates', templateRoutes);

module.exports = router; 