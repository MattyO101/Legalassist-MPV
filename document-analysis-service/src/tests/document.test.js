const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Document = require('../models/document.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

describe('Document API', () => {
  let testUserId;
  let testToken;
  let testDocumentId;

  beforeAll(async () => {
    // Connect to test database
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist-documents-test';
    await mongoose.connect(url);

    // Clean up test database
    await Document.deleteMany({});

    // Create a test user ID and token
    testUserId = new mongoose.Types.ObjectId().toString();
    
    const payload = {
      sub: testUserId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    
    testToken = jwt.sign(payload, config.jwt.secret);

    // Create a test document
    const testDocument = await Document.create({
      userId: testUserId,
      title: 'Test Document',
      originalFilename: 'test.txt',
      filename: 'test-123456.txt',
      fileType: 'txt',
      fileSize: 1024,
      status: 'uploaded',
    });

    testDocumentId = testDocument._id.toString();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Document.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/documents', () => {
    it('should get all documents for a user', async () => {
      const response = await request(app)
        .get('/api/documents')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.documents).toBeDefined();
      expect(response.body.documents.length).toBe(1);
      expect(response.body.documents[0].title).toBe('Test Document');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/documents');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/documents/:id', () => {
    it('should get a document by ID', async () => {
      const response = await request(app)
        .get(`/api/documents/${testDocumentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.document).toBeDefined();
      expect(response.body.document.title).toBe('Test Document');
    });

    it('should return 404 for non-existent document', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/documents/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/documents/:id/status', () => {
    it('should get document status', async () => {
      const response = await request(app)
        .get(`/api/documents/${testDocumentId}/status`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('uploaded');
    });
  });

  // Upload document test would require file upload handling which is more complex
  // This would be better tested with mocking or integration tests
}); 