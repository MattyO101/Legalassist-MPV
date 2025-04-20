const axios = require('axios');
const fs = require('fs');
const Document = require('../models/document.model');
const Recommendation = require('../models/recommendation.model');
const fileStorage = require('../utils/fileStorage');
const documentService = require('./document.service');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const analyzeDocument = async (documentId, userId) => {
  // Get document and check ownership
  const document = await documentService.getDocument(documentId, userId);
  
  if (document.status === 'processing') {
    throw ApiError.badRequest('Document is already being processed');
  }
  
  if (document.status === 'completed') {
    throw ApiError.badRequest('Document has already been analyzed');
  }
  
  // Update status to processing
  await documentService.updateDocumentStatus(documentId, userId, 'processing');
  
  try {
    // Read file content
    let fileContent;
    
    try {
      fileContent = await fileStorage.readDocument(document.filename);
    } catch (error) {
      // If we can't read the file as text (e.g., for binary files like PDF)
      // For MVP, we'll simulate this with a mock analysis for demo purposes
      fileContent = 'Sample content for demonstration purposes. This is a mock analysis for the MVP.';
    }
    
    // For the MVP, we'll use a simulated analysis for demo purposes
    // In a real implementation, we would call an external NLP service
    
    // Simulated analysis results
    const simulatedAnalysis = simulateDocumentAnalysis(fileContent, document.fileType);
    
    // Create recommendations from analysis
    const recommendations = simulatedAnalysis.map(rec => ({
      documentId,
      type: rec.type,
      content: rec.content,
      originalText: rec.original,
      suggestedText: rec.suggested,
      severity: rec.severity,
      status: 'pending'
    }));
    
    // Save recommendations
    await Recommendation.insertMany(recommendations);
    
    // Update document status
    await documentService.updateDocumentStatus(documentId, userId, 'completed');
    
    return { success: true, count: recommendations.length };
  } catch (error) {
    // Update document status to failed
    await documentService.updateDocumentStatus(documentId, userId, 'failed');
    
    throw new ApiError(500, 'Document analysis failed', true, error.stack);
  }
};

const getDocumentRecommendations = async (documentId, userId) => {
  // Verify document ownership
  await documentService.getDocument(documentId, userId);
  
  // Get recommendations
  const recommendations = await Recommendation.find({ documentId }).sort({ severity: -1, createdAt: -1 });
  
  return recommendations;
};

const updateRecommendationStatus = async (recommendationId, userId, status) => {
  const recommendation = await Recommendation.findById(recommendationId);
  
  if (!recommendation) {
    throw ApiError.notFound('Recommendation not found');
  }
  
  // Verify document ownership
  await documentService.getDocument(recommendation.documentId, userId);
  
  // Update status
  recommendation.status = status;
  await recommendation.save();
  
  return recommendation;
};

// Mock function for simulating document analysis for the MVP
const simulateDocumentAnalysis = (content, fileType) => {
  // Simple patterns to look for in legal documents
  const patterns = [
    {
      regex: /\b(?:obligations|duties|responsibilities)\b/i,
      type: 'information',
      content: 'Clearly define all obligations and responsibilities',
      original: null,
      suggested: null,
      severity: 'medium'
    },
    {
      regex: /\b(?:terminate|termination|cancel|cancellation)\b/i,
      type: 'addition',
      content: 'Add a clear termination clause',
      original: null,
      suggested: 'Either party may terminate this agreement with 30 days written notice.',
      severity: 'high'
    },
    {
      regex: /\b(?:pay|payment|compensation|fee)\b/i,
      type: 'modification',
      content: 'Clarify payment terms',
      original: 'Payment will be made upon completion.',
      suggested: 'Payment will be made within 30 days of invoice receipt.',
      severity: 'high'
    },
    {
      regex: /\b(?:confiden|secret|proprietary)\b/i,
      type: 'information',
      content: 'Review confidentiality provisions',
      original: null,
      suggested: null,
      severity: 'medium'
    },
    {
      regex: /\b(?:liable|liability|indemnify|indemnification)\b/i,
      type: 'modification',
      content: 'Consider limiting liability',
      original: 'The Company shall be liable for all damages.',
      suggested: 'The Company\'s liability shall be limited to the total amount paid under this agreement.',
      severity: 'high'
    },
    {
      regex: /\b(?:law|governing|jurisdiction)\b/i,
      type: 'addition',
      content: 'Add governing law clause',
      original: null,
      suggested: 'This agreement shall be governed by the laws of [State/Country].',
      severity: 'medium'
    },
    {
      regex: /\b(?:dispute|arbitration|mediation)\b/i,
      type: 'information',
      content: 'Consider adding dispute resolution mechanism',
      original: null,
      suggested: null,
      severity: 'low'
    },
    {
      regex: /\b(?:warranty|guarantee|assurance)\b/i,
      type: 'modification',
      content: 'Clarify warranty provisions',
      original: 'Full warranty provided.',
      suggested: 'Limited warranty for 90 days covering defects in materials and workmanship.',
      severity: 'medium'
    }
  ];
  
  // Generate some recommendations based on the content
  const recommendations = [];
  
  // Add some sample recommendations for demo purposes
  patterns.forEach(pattern => {
    if (Math.random() > 0.4 || pattern.regex.test(content)) {
      recommendations.push({
        type: pattern.type,
        content: pattern.content,
        original: pattern.original,
        suggested: pattern.suggested,
        severity: pattern.severity
      });
    }
  });
  
  // Always ensure we have at least 3 recommendations for demo purposes
  if (recommendations.length < 3) {
    recommendations.push(
      {
        type: 'addition',
        content: 'Add a force majeure clause',
        original: null,
        suggested: 'Neither party shall be liable for failure to perform due to events beyond their reasonable control.',
        severity: 'medium'
      },
      {
        type: 'modification',
        content: 'Improve clarity of intellectual property rights',
        original: 'All intellectual property belongs to the company.',
        suggested: 'All intellectual property created during the performance of this agreement shall belong to the Company, while pre-existing intellectual property shall remain with its original owner.',
        severity: 'high'
      },
      {
        type: 'information',
        content: 'Consider adding a non-solicitation clause',
        original: null,
        suggested: null,
        severity: 'low'
      }
    );
  }
  
  return recommendations;
};

module.exports = {
  analyzeDocument,
  getDocumentRecommendations,
  updateRecommendationStatus,
}; 