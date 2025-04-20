const path = require('path');
const Document = require('../models/document.model');
const fileStorage = require('../utils/fileStorage');
const ApiError = require('../utils/ApiError');

const getDocuments = async (userId) => {
  return Document.find({ userId }).sort({ createdAt: -1 });
};

const getDocument = async (id, userId) => {
  const document = await Document.findOne({ _id: id, userId });
  
  if (!document) {
    throw ApiError.notFound('Document not found');
  }
  
  return document;
};

const createDocument = async (userId, file, title) => {
  // Determine file type from extension
  const ext = path.extname(file.originalname).toLowerCase();
  let fileType;
  
  if (ext === '.pdf') {
    fileType = 'pdf';
  } else if (ext === '.docx') {
    fileType = 'docx';
  } else if (ext === '.txt') {
    fileType = 'txt';
  } else {
    throw ApiError.badRequest('Unsupported file type');
  }
  
  // Create document record
  const document = await Document.create({
    userId,
    title: title || file.originalname,
    originalFilename: file.originalname,
    filename: file.filename,
    fileType,
    fileSize: file.size,
    status: 'uploaded',
  });
  
  return document;
};

const updateDocumentStatus = async (id, userId, status) => {
  const document = await getDocument(id, userId);
  
  document.status = status;
  
  if (status === 'completed') {
    document.analyzedAt = new Date();
  }
  
  await document.save();
  
  return document;
};

const deleteDocument = async (id, userId) => {
  const document = await getDocument(id, userId);
  
  // Delete the file
  await fileStorage.deleteDocument(document.filename);
  
  // Delete the document record
  await Document.deleteOne({ _id: id });
  
  return { success: true };
};

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocumentStatus,
  deleteDocument,
}; 