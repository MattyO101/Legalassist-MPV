const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');
const { generateAuthTokens } = require('../utils/jwt');

describe('Auth API', () => {
  let testUser;
  let testTokens;

  beforeAll(async () => {
    // Connect to test database
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist-test';
    await mongoose.connect(url);

    // Clean up test database
    await User.deleteMany({});

    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    });

    // Generate tokens for the test user
    testTokens = await generateAuthTokens(testUser);
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.tokens).toBeDefined();
      expect(response.body.user.email).toBe('new@example.com');
    });

    it('should return 400 if email is already taken', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User Duplicate',
          email: 'test@example.com', // Already exists
          password: 'Password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already taken');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.tokens).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Incorrect email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testTokens.access.token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Please authenticate');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: testTokens.refresh.token
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.access).toBeDefined();
      expect(response.body.tokens.refresh).toBeDefined();
    });

    it('should return 400 without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Refresh token is required');
    });
  });
}); 