const express = require('express');
const documentController = require('../controllers/document.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all user documents
router.get('/', documentController.getDocuments);

// Upload a new document
router.post('/', upload.single('document'), documentController.uploadDocument);

// Get a specific document
router.get('/:id', documentController.getDocument);

// Delete a document
router.delete('/:id', documentController.deleteDocument);

// Analyze document
router.post('/:id/analyze', documentController.analyzeDocument);

// Check document analysis status
router.get('/:id/status', documentController.getDocumentStatus);

module.exports = router; 