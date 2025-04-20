const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Template = require('../models/template.model');
const UserTemplate = require('../models/userTemplate.model');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

describe('Template API', () => {
  let testUserId;
  let testToken;
  let testTemplateId;

  beforeAll(async () => {
    // Connect to test database
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist-templates-test';
    await mongoose.connect(url);

    // Clean up test database
    await Template.deleteMany({});
    await UserTemplate.deleteMany({});

    // Create a test user ID and token
    testUserId = new mongoose.Types.ObjectId().toString();
    
    const payload = {
      sub: testUserId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    
    testToken = jwt.sign(payload, config.jwt.secret);

    // Create a test template
    const testTemplate = await Template.create({
      title: 'Test Template',
      description: 'This is a test template',
      category: 'contract',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          required: true,
        }
      ],
      content: 'This is a contract between {{name}} dated {{date}}.',
      isActive: true,
    });

    testTemplateId = testTemplate._id.toString();
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Template.deleteMany({});
    await UserTemplate.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/templates', () => {
    it('should get all templates', async () => {
      const response = await request(app)
        .get('/api/templates');

      expect(response.status).toBe(200);
      expect(response.body.templates).toBeDefined();
      expect(response.body.templates.length).toBe(1);
      expect(response.body.templates[0].title).toBe('Test Template');
    });
  });

  describe('GET /api/templates/:id', () => {
    it('should get a template by ID', async () => {
      const response = await request(app)
        .get(`/api/templates/${testTemplateId}`);

      expect(response.status).toBe(200);
      expect(response.body.template).toBeDefined();
      expect(response.body.template.title).toBe('Test Template');
    });

    it('should return 404 for non-existent template', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/templates/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/templates/categories', () => {
    it('should get template categories', async () => {
      const response = await request(app)
        .get('/api/templates/categories');

      expect(response.status).toBe(200);
      expect(response.body.categories).toBeDefined();
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories).toContain('contract');
    });
  });

  describe('POST /api/templates/:id/customize', () => {
    it('should customize a template', async () => {
      const response = await request(app)
        .post(`/api/templates/${testTemplateId}/customize`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          name: 'John Doe',
          date: '2023-06-01',
        });

      expect(response.status).toBe(200);
      expect(response.body.template).toBeDefined();
      expect(response.body.customizedData).toBeDefined();
      expect(response.body.customizedData.name).toBe('John Doe');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post(`/api/templates/${testTemplateId}/customize`)
        .send({
          name: 'John Doe',
          date: '2023-06-01',
        });

      expect(response.status).toBe(401);
    });
  });
}); 