const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

// API routes
router.use('/auth', authRoutes);

module.exports = router; 