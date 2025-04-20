const fs = require('fs');
const path = require('path');
const util = require('util');
const ApiError = require('./ApiError');

// Convert fs functions to promise-based
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

const getUploadPath = (filename) => {
  return path.join(__dirname, '../uploads', filename);
};

const readDocument = async (filename) => {
  try {
    const filePath = getUploadPath(filename);
    const data = await readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw ApiError.notFound('Document file not found');
    }
    throw ApiError.serverError('Error reading document file');
  }
};

const saveDocument = async (filename, content) => {
  try {
    const filePath = getUploadPath(filename);
    await writeFile(filePath, content);
    return true;
  } catch (error) {
    throw ApiError.serverError('Error saving document file');
  }
};

const deleteDocument = async (filename) => {
  try {
    const filePath = getUploadPath(filename);
    await unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return true; // File doesn't exist, so it's already "deleted"
    }
    throw ApiError.serverError('Error deleting document file');
  }
};

module.exports = {
  readDocument,
  saveDocument,
  deleteDocument,
  getUploadPath,
}; 