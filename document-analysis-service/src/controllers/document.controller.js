const documentService = require('../services/document.service');
const analysisService = require('../services/analysis.service');
const ApiError = require('../utils/ApiError');

const getDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getDocuments(req.user.id);
    res.status(200).json({ documents });
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await documentService.getDocument(req.params.id, req.user.id);
    res.status(200).json({ document });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    
    const { title } = req.body;
    const document = await documentService.createDocument(req.user.id, req.file, title);
    
    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
};

const analyzeDocument = async (req, res, next) => {
  try {
    const result = await analysisService.analyzeDocument(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getDocumentStatus = async (req, res, next) => {
  try {
    const document = await documentService.getDocument(req.params.id, req.user.id);
    res.status(200).json({ status: document.status });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const result = await documentService.deleteDocument(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  getDocument,
  uploadDocument,
  analyzeDocument,
  getDocumentStatus,
  deleteDocument,
}; 