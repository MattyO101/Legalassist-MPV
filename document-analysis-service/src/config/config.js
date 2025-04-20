require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9001,
  mongoose: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-document-service-secret-key',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
  },
  api: {
    textAnalysis: process.env.TEXT_ANALYSIS_API_URL || 'https://api.textanalysis.example',
    apiKey: process.env.TEXT_ANALYSIS_API_KEY || 'your-api-key',
  }
};

module.exports = config; 