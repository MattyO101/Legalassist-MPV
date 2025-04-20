# LegalAssist MVP Backend Structure

This document outlines the simplified structure for the backend services, focusing on the core features of document analysis and template management.

## Overall Architecture

```
legalassist-mvp/
├── auth-service/            # Authentication service
├── document-analysis-service/ # Document analysis service
└── template-service/        # Template service
```

Each service will run independently, with clearly defined API contracts between them. For the MVP, we'll simplify the architecture to focus on functionality rather than scalability.

## Port Allocation

To avoid port conflicts, we'll explicitly define port usage:

- Auth Service: Port 9000
- Document Analysis Service: Port 9001
- Template Service: Port 9002
- Frontend: Port 3000

## Auth Service

```
auth-service/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── services/
│   │   └── auth.service.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── ApiError.js
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

### Key Features

- User registration and login
- JWT token generation and validation
- Password reset functionality
- Simple MongoDB schema for user data

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| /api/auth/register | POST | Register a new user | No |
| /api/auth/login | POST | Login existing user | No |
| /api/auth/me | GET | Get current user profile | Yes |
| /api/auth/refresh | POST | Refresh access token | Yes |
| /api/auth/forgot-password | POST | Request password reset | No |
| /api/auth/reset-password | POST | Reset password with token | No |

## Document Analysis Service

```
document-analysis-service/
├── src/
│   ├── controllers/
│   │   ├── document.controller.js
│   │   └── recommendation.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT validation
│   │   ├── upload.middleware.js # File upload handling
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── document.model.js
│   │   └── recommendation.model.js
│   ├── routes/
│   │   ├── document.routes.js
│   │   └── recommendation.routes.js
│   ├── services/
│   │   ├── document.service.js
│   │   ├── analysis.service.js
│   │   └── recommendation.service.js
│   ├── utils/
│   │   ├── fileStorage.js
│   │   └── ApiError.js
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

### Key Features

- Document upload and storage
- Document analysis using third-party NLP services
- Recommendation generation and management
- Document status tracking

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| /api/documents | GET | Get user's documents | Yes |
| /api/documents | POST | Upload a document | Yes |
| /api/documents/:id | GET | Get document details | Yes |
| /api/documents/:id | DELETE | Delete a document | Yes |
| /api/documents/:id/analyze | POST | Start document analysis | Yes |
| /api/documents/:id/status | GET | Check analysis status | Yes |
| /api/recommendations/document/:id | GET | Get recommendations for document | Yes |
| /api/recommendations/:id/apply | POST | Apply a recommendation | Yes |
| /api/recommendations/:id/reject | POST | Reject a recommendation | Yes |

## Template Service

```
template-service/
├── src/
│   ├── controllers/
│   │   └── template.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT validation
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── template.model.js
│   │   └── userTemplate.model.js
│   ├── routes/
│   │   └── template.routes.js
│   ├── services/
│   │   ├── template.service.js
│   │   └── export.service.js
│   ├── utils/
│   │   ├── docxGenerator.js
│   │   ├── pdfGenerator.js
│   │   └── ApiError.js
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   ├── data/
│   │   └── templates/          # Template JSON definitions
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

### Key Features

- Template storage and retrieval
- Template categorization
- Template customization
- Document generation from templates (PDF, DOCX)

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| /api/templates | GET | Get all templates | Yes |
| /api/templates/categories | GET | Get template categories | Yes |
| /api/templates/:id | GET | Get template details | Yes |
| /api/templates/:id/customize | POST | Customize a template | Yes |
| /api/templates/:id/export | POST | Export customized template | Yes |
| /api/templates/user | GET | Get user's saved templates | Yes |
| /api/templates/user | POST | Save customized template | Yes |
| /api/templates/user/:id | DELETE | Delete saved template | Yes |

## Shared Code Structure

Each service will share similar utility code for consistent implementation:

### Authentication Middleware

```javascript
// auth.middleware.js (simplified from existing code)
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized access');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Access token not provided');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};

module.exports = auth;
```

### Error Handling

```javascript
// errorHandler.js (simplified from existing code)
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;
  
  // If not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  const response = {
    code: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
  
  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
```

### API Error Utility

```javascript
// ApiError.js (reused from existing code)
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = null;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  static badRequest(message) {
    return new ApiError(400, message);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }
  
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }
  
  static serverError(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
```

## Document Analysis Implementation

We'll reuse and simplify parts of the existing document analysis service:

### Document Upload

```javascript
// upload.middleware.js (simplified from existing code)
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF, DOCX, and TXT files are allowed'));
  }
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  }
});

module.exports = upload;
```

### Analysis Service

```javascript
// analysis.service.js (simplified implementation)
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Document = require('../models/document.model');
const Recommendation = require('../models/recommendation.model');
const ApiError = require('../utils/ApiError');

// Simplified analysis using a third-party API
const analyzeDocument = async (documentId, userId) => {
  const document = await Document.findOne({ _id: documentId, userId });
  
  if (!document) {
    throw ApiError.notFound('Document not found');
  }
  
  // Update status to processing
  document.status = 'processing';
  await document.save();
  
  try {
    // Read file content
    const filePath = path.join(__dirname, '../uploads', document.filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Call external API for analysis
    // In a real implementation, this would be a more sophisticated service
    const response = await axios.post('https://api.textanalysis.example/analyze', {
      text: fileContent,
      documentType: document.fileType
    });
    
    // Process recommendations from analysis
    const recommendations = response.data.recommendations.map(rec => ({
      documentId,
      type: rec.type,
      content: rec.content,
      originalText: rec.original,
      suggestedText: rec.suggested,
      severity: rec.severity || 'medium',
      status: 'pending'
    }));
    
    // Save recommendations
    await Recommendation.insertMany(recommendations);
    
    // Update document status
    document.status = 'completed';
    document.analyzedAt = new Date();
    await document.save();
    
    return { success: true, count: recommendations.length };
  } catch (error) {
    // Update document status to failed
    document.status = 'failed';
    await document.save();
    
    throw new ApiError(500, 'Document analysis failed', true, error.stack);
  }
};

module.exports = {
  analyzeDocument
};
```

## Template Service Implementation

### Template Model

```javascript
// template.model.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['contract', 'agreement', 'letter', 'form', 'policy', 'other']
  },
  fields: [{
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'textarea', 'date', 'select', 'checkbox']
    },
    options: [String], // For select fields
    required: {
      type: Boolean,
      default: false
    },
    defaultValue: String,
    placeholder: String,
    description: String
  }],
  content: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
```

### Template Export Service

```javascript
// export.service.js (simplified implementation)
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ApiError = require('../utils/ApiError');

// Export template as DOCX
const exportAsDocx = async (template, data) => {
  try {
    // Load the template docx file
    const templatePath = path.join(__dirname, '../data/templates', `${template.category}.docx`);
    const content = fs.readFileSync(templatePath, 'binary');
    
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);
    
    // Set the template variables
    doc.setData(data);
    
    // Render the document
    doc.render();
    
    // Get the output
    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });
    
    // Generate a unique filename
    const filename = `${template.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.docx`;
    const outputPath = path.join(__dirname, '../exports', filename);
    
    // Ensure the exports directory exists
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(outputPath, buffer);
    
    return {
      filename,
      path: outputPath
    };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate DOCX', true, error.stack);
  }
};

// Export template as PDF
const exportAsPdf = async (template, data) => {
  try {
    // Generate a unique filename
    const filename = `${template.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '../exports', filename);
    
    // Ensure the exports directory exists
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    // Create a PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);
    
    // Add content to the PDF
    doc.fontSize(16).text(template.title, { align: 'center' });
    doc.moveDown();
    
    // Simple template rendering - in a real app, this would be more sophisticated
    let content = template.content;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, data[key]);
    });
    
    doc.fontSize(12).text(content);
    
    // Finalize the PDF
    doc.end();
    
    // Wait for the stream to finish
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve({
          filename,
          path: outputPath
        });
      });
      
      stream.on('error', (error) => {
        reject(new ApiError(500, 'Failed to generate PDF', true, error.stack));
      });
    });
  } catch (error) {
    throw new ApiError(500, 'Failed to generate PDF', true, error.stack);
  }
};

module.exports = {
  exportAsDocx,
  exportAsPdf
};
```

## Configuration and Environment

Each service will have a consistent approach to configuration:

```javascript
// config.js
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9000,
  mongoose: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist-mvp',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
  },
};

module.exports = config;
```

## Conclusion

This backend structure provides a simplified yet comprehensive approach for the LegalAssist MVP. By focusing on just the essential services (auth, document analysis, and templates) and reusing proven code patterns, we can build a solid foundation without overengineering. The architecture is designed to be maintainable, scalable within reason, and focused on delivering the core value propositions of the application. 