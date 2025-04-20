# LegalAssist MVP

A microservices-based application that helps users review and create legal documents with AI assistance.

## Project Overview

LegalAssist MVP is composed of three main services:

1. **Auth Service**: Handles user authentication and authorization
2. **Document Analysis Service**: Processes and analyzes legal documents
3. **Template Service**: Manages legal document templates and customization
4. **Frontend**: React-based user interface

## Architecture

```
┌─────────────┐      ┌─────────────────────┐      ┌────────────────────┐
│             │      │                     │      │                    │
│  Frontend   │◄────►│    Auth Service     │◄────►│  Document Analysis │
│  (React)    │      │    (Node.js)        │      │  Service (Node.js) │
│             │      │                     │      │                    │
└─────────────┘      └─────────────────────┘      └────────────────────┘
       ▲                                                  ▲
       │                                                  │
       │              ┌─────────────────┐                │
       │              │                 │                │
       └──────────────►  Template       ◄────────────────┘
                      │  Service        │
                      │  (Node.js)      │
                      │                 │
                      └─────────────────┘
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/MattyO101/Legalassist-MPV.git
cd Legalassist-MPV
```

2. Install dependencies for each service and the frontend

```bash
# Auth Service
cd auth-service
npm install

# Document Analysis Service
cd ../document-analysis-service
npm install

# Template Service
cd ../template-service
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables

Copy the `.env.example` file in each service directory to create a `.env` file, and update the values as needed.

4. Start the services

```bash
# Auth Service
cd auth-service
npm run dev

# Document Analysis Service
cd ../document-analysis-service
npm run dev

# Template Service
cd ../template-service
npm run dev

# Frontend
cd ../frontend
npm start
```

## API Endpoints

### Auth Service (default port: 9000)

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh-token` - Refresh access token
- GET `/api/auth/me` - Get current user profile
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Document Analysis Service (default port: 9001)

- GET `/api/documents` - List user documents
- POST `/api/documents` - Upload document
- GET `/api/documents/:id` - Get document details
- POST `/api/documents/:id/analyze` - Analyze document
- GET `/api/documents/:id/status` - Get analysis status
- GET `/api/recommendations/document/:documentId` - Get document recommendations

### Template Service (default port: 9002)

- GET `/api/templates` - List templates
- GET `/api/templates/categories` - Get template categories
- GET `/api/templates/:id` - Get template details
- POST `/api/templates/:id/customize` - Customize template
- POST `/api/templates/:id/export` - Export customized template

## Testing

Each service has its own test suite. To run tests:

```bash
cd [service-directory]
npm test
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Security headers with Helmet
- CORS protection

## License

[MIT License](LICENSE) 