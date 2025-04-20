require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9000,
  mongoose: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-auth-service-secret-key',
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10) || 30,
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS, 10) || 30,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }
};

module.exports = config; 