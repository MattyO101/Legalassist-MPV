# LegalAssist MVP Quick Start Guide

This guide provides instructions to quickly set up and start developing the LegalAssist MVP. It focuses on simplicity and getting the core features running with minimal configuration.

## Prerequisites

- Node.js (v14.x or later)
- MongoDB (v4.x or later)
- Git

## Project Setup

### 1. Clone the Repository

```bash
# Create a new project directory
mkdir legalassist-mvp
cd legalassist-mvp

# Initialize git repository
git init
```

### 2. Project Structure

Create the following directory structure:

```
legalassist-mvp/
├── auth-service/
├── document-analysis-service/
├── template-service/
└── frontend/
```

```bash
# Create directory structure
mkdir -p auth-service document-analysis-service template-service frontend
```

### 3. Setting Up Services

#### Auth Service

```bash
cd auth-service

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose jsonwebtoken bcryptjs dotenv cors helmet express-rate-limit

# Install dev dependencies
npm install --save-dev nodemon

# Create basic directory structure
mkdir -p src/{controllers,middleware,models,routes,services,utils,config}

# Create initial files
touch src/app.js src/server.js
touch .env .env.example .gitignore README.md
```

Add scripts to package.json:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

#### Document Analysis Service

```bash
cd ../document-analysis-service

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose jsonwebtoken multer axios dotenv cors helmet express-rate-limit

# Install dev dependencies
npm install --save-dev nodemon

# Create basic directory structure
mkdir -p src/{controllers,middleware,models,routes,services,utils,config} src/uploads

# Create initial files
touch src/app.js src/server.js
touch .env .env.example .gitignore README.md
```

Add scripts to package.json:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

#### Template Service

```bash
cd ../template-service

# Initialize package.json
npm init -y

# Install dependencies
npm install express mongoose jsonwebtoken dotenv cors helmet express-rate-limit docxtemplater pizzip pdfkit

# Install dev dependencies
npm install --save-dev nodemon

# Create basic directory structure
mkdir -p src/{controllers,middleware,models,routes,services,utils,config} src/data/templates src/exports

# Create initial files
touch src/app.js src/server.js
touch .env .env.example .gitignore README.md
```

Add scripts to package.json:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

#### Frontend

```bash
cd ../frontend

# Create React app with TypeScript
npx create-react-app . --template typescript

# Install additional dependencies
npm install react-router-dom axios styled-components react-icons

# Create directory structure
mkdir -p src/{components,pages,context,services,utils,styles,types}
mkdir -p src/components/{common,auth,documents,templates}

# Move and rename index.js to index.tsx if needed
```

### 4. Environment Configuration

Create a `.env` file in each service directory with the following contents (adjusted for each service):

**Auth Service (.env)**
```
NODE_ENV=development
PORT=9000
MONGODB_URL=mongodb://localhost:27017/legalassist-auth
JWT_SECRET=your-auth-service-secret-key
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
CORS_ORIGIN=http://localhost:3000
```

**Document Analysis Service (.env)**
```
NODE_ENV=development
PORT=9001
MONGODB_URL=mongodb://localhost:27017/legalassist-documents
JWT_SECRET=your-document-service-secret-key
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760 # 10 MB
```

**Template Service (.env)**
```
NODE_ENV=development
PORT=9002
MONGODB_URL=mongodb://localhost:27017/legalassist-templates
JWT_SECRET=your-template-service-secret-key
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:9000/api
REACT_APP_DOCUMENT_API_URL=http://localhost:9001/api
REACT_APP_TEMPLATE_API_URL=http://localhost:9002/api
```

### 5. Initial Setup for Each Service

#### Auth Service

Create basic server.js file:

```javascript
// src/server.js
const app = require('./app');
const config = require('./config/config');
const mongoose = require('mongoose');

let server;

// Connect to MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log('Connected to MongoDB');
    server = app.listen(config.port, () => {
      console.log(`Auth service listening on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Handle unexpected errors
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
```

Create basic app.js file (repeat similar structure for other services with appropriate routes):

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const config = require('./config/config');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// API routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
```

#### Create a config.js file for each service:

```javascript
// src/config/config.js
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9000,
  mongoose: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/legalassist-auth',
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
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }
};

module.exports = config;
```

### 6. Reusing Existing Components

#### Copy and Adapt DocumentUpload Component

```bash
# Navigate to frontend directory
cd ../frontend

# Copy the DocumentUpload component from existing code
cp /path/to/existing/DocumentUpload.tsx src/components/documents/
```

Edit the imports and adapt as needed to fit the new structure.

#### Copy and Adapt DocumentAnalysis Component

```bash
# Copy the DocumentAnalysis component from existing code
cp /path/to/existing/DocumentAnalysis.tsx src/components/documents/
```

Edit the imports and adapt as needed to fit the new structure.

#### Copy and Adapt TemplateBrowser Component

```bash
# Copy the TemplateBrowser component from existing code
cp /path/to/existing/TemplateBrowser.tsx src/components/templates/
```

Edit the imports and adapt as needed to fit the new structure.

### 7. Starting Development

#### Backend Services

Start each service (in separate terminals):

```bash
# Auth Service
cd auth-service
npm run dev

# Document Analysis Service
cd document-analysis-service
npm run dev

# Template Service
cd template-service
npm run dev
```

#### Frontend

```bash
cd frontend
npm start
```

The React app should open in your browser at http://localhost:3000.

## Development Workflow

### 1. Implement Core APIs

Begin by implementing the core APIs for each service according to the endpoints defined in the MVP Backend Structure document.

### 2. Create Basic Frontend Pages

Implement the basic frontend pages:
- Authentication (Login/Signup)
- Dashboard
- Document Analysis
- Template Library

### 3. Connect Frontend to Backend

Set up API services in the frontend to communicate with the backend services.

### 4. Test Core Workflows

Test the main user flows:
- User registration and login
- Document upload and analysis
- Viewing and applying recommendations
- Browsing and customizing templates

## Development Tips

1. **Focus on Core Functionality First**: Get the basic features working before adding more complexity.

2. **Test Frequently**: Test each component and API endpoint as you develop them.

3. **Use Postman or Similar Tool**: Test API endpoints independently of the frontend.

4. **Collaborate and Communicate**: Keep team members informed of your progress and any issues.

5. **Commit Frequently**: Make small, focused commits with clear messages.

6. **Follow the MVP Plan**: Avoid the temptation to add features beyond the MVP scope.

7. **Port Management**: Be vigilant about service ports to avoid conflicts.

8. **Document As You Go**: Update documentation as you implement features.

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If you see "EADDRINUSE" errors, check if another service is using the same port.

2. **MongoDB Connection**: Ensure MongoDB is running and accessible.

3. **CORS Issues**: If you see CORS errors, check that the CORS configuration in your backend services matches your frontend origin.

4. **JWT Authentication**: Verify that the JWT secret is consistent between services for token validation.

5. **File Upload Errors**: Check file size limits and allowed file types.

6. **React Router Issues**: Ensure routes are properly defined and components are correctly imported.

7. **API Connection**: Verify API URLs in the frontend environment variables.

## Next Steps After MVP

Once the MVP is functioning, consider:

1. **User Feedback**: Gather feedback from early users.

2. **Refinement**: Polish the user interface and experience.

3. **Testing**: Conduct more thorough testing, including usability tests.

4. **Documentation**: Complete documentation for developers and users.

5. **Deployment**: Prepare for production deployment. 