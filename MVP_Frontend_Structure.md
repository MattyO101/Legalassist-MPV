# LegalAssist MVP Frontend Structure

This document outlines the structure for the simplified frontend application, focusing on the core features of document analysis and template management.

## Directory Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/           # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── PasswordReset.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── documents/        # Document analysis components
│   │   │   ├── DocumentUpload.tsx      # Reused from existing code
│   │   │   ├── DocumentAnalysis.tsx    # Simplified from existing code
│   │   │   ├── RecommendationList.tsx
│   │   │   └── DocumentList.tsx
│   │   └── templates/        # Template components
│   │       ├── TemplateBrowser.tsx     # Adapted from existing code
│   │       ├── TemplateCard.tsx
│   │       ├── TemplateCustomizer.tsx
│   │       └── TemplatePreview.tsx
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── DocumentAnalysis.tsx
│   │   └── TemplateLibrary.tsx
│   ├── context/              # React Context for state management
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── DocumentContext.tsx
│   │   └── TemplateContext.tsx
│   ├── services/             # API services
│   │   ├── apiService.ts     # Base API configuration
│   │   ├── authService.ts
│   │   ├── documentService.ts
│   │   └── templateService.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── document.types.ts
│   │   └── template.types.ts
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── errorHandlers.ts
│   ├── styles/               # Global styles
│   │   ├── globalStyles.ts
│   │   ├── theme.ts
│   │   └── variables.ts
│   ├── App.tsx               # Main application component
│   ├── index.tsx             # Application entry point
│   └── routes.tsx            # Application routes
└── package.json
```

## Reused Components

### DocumentUpload.tsx
This component from the existing codebase will be reused with minimal changes:
- Clean, well-structured upload interface
- Progress indicator
- File validation
- Error handling

### DocumentAnalysis.tsx
This component will be adapted:
- Simplify the recommendation display
- Focus on core functionality (viewing and acting on recommendations)
- Maintain the clean UI approach

### TemplateBrowser.tsx
This component will serve as a foundation:
- Adapt to work with our simplified state management
- Focus on template browsing and selection

## Key Components to Build

### Authentication Components
- Simple login/signup forms
- Password reset functionality
- Protected route wrapper

### Dashboard
- Overview of recently analyzed documents
- Quick access to template library
- User profile information

### Template Customizer
- Form-based approach to template customization
- Live preview of changes
- Export options

## State Management

We'll use React Context for simplified state management:

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
```

### DocumentContext
```typescript
interface DocumentContextType {
  documents: Document[];
  selectedDocument: Document | null;
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  uploadDocument: (file: File) => Promise<void>;
  analyzeDocument: (documentId: string) => Promise<void>;
  getDocuments: () => Promise<void>;
  applyRecommendation: (recommendationId: string) => Promise<void>;
  rejectRecommendation: (recommendationId: string) => Promise<void>;
}
```

### TemplateContext
```typescript
interface TemplateContextType {
  templates: Template[];
  selectedTemplate: Template | null;
  customizedTemplate: Template | null;
  loading: boolean;
  error: string | null;
  getTemplates: () => Promise<void>;
  selectTemplate: (templateId: string) => Promise<void>;
  customizeTemplate: (templateId: string, data: any) => Promise<void>;
  saveTemplate: (template: Template) => Promise<void>;
  exportTemplate: (templateId: string, format: 'pdf' | 'docx') => Promise<void>;
}
```

## Styling Approach

We'll use Styled Components for styling with a consistent theme:

```typescript
// theme.ts
export const theme = {
  colors: {
    primary: '#3498db',       // Blue for primary actions
    secondary: '#2c3e50',     // Dark slate for headers
    success: '#2ecc71',       // Green for success states
    error: '#e74c3c',         // Red for errors
    warning: '#f39c12',       // Orange for warnings
    background: '#f5f7fa',    // Light gray for backgrounds
    card: '#ffffff',          // White for cards
    text: {
      primary: '#2c3e50',     // Dark slate for primary text
      secondary: '#7f8c8d',   // Medium gray for secondary text
      light: '#ecf0f1'        // Light gray for text on dark backgrounds
    }
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif"
  },
  fontSizes: {
    small: '0.875rem',
    body: '1rem',
    large: '1.125rem',
    h1: '2rem',
    h2: '1.5rem',
    h3: '1.25rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    small: '4px',
    medium: '6px',
    large: '8px',
    round: '50%'
  },
  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevated: '0 4px 6px rgba(0, 0, 0, 0.12)'
  }
};
```

## API Services

### Base API Service
```typescript
// apiService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Routes Configuration

```typescript
// routes.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DocumentAnalysis from './pages/DocumentAnalysis';
import TemplateLibrary from './pages/TemplateLibrary';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/documents" 
        element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} 
      />
      <Route 
        path="/templates" 
        element={<ProtectedRoute><TemplateLibrary /></ProtectedRoute>} 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
```

## Conclusion

This frontend structure provides a simplified yet comprehensive approach for the LegalAssist MVP. By leveraging existing components where they work well and implementing a more streamlined architecture, we can avoid the previous issues of overengineering while still delivering a high-quality product. The structure balances reusability, maintainability, and development speed, focusing on the core requirements of document analysis and template management. 