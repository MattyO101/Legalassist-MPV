import axios from 'axios';

// Base API URLs for different services
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';
const DOCUMENT_API_URL = process.env.REACT_APP_DOCUMENT_API_URL || 'http://localhost:9001/api';
const TEMPLATE_API_URL = process.env.REACT_APP_TEMPLATE_API_URL || 'http://localhost:9002/api';

// Create axios instances for each service
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const documentApi = axios.create({
  baseURL: DOCUMENT_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const templateApi = axios.create({
  baseURL: TEMPLATE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
const addAuthToken = (api: typeof axios) => {
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
};

// Response interceptor for handling errors
const handleErrors = (api: typeof axios) => {
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
};

// Apply interceptors to all APIs
[authApi, documentApi, templateApi].forEach(api => {
  addAuthToken(api);
  handleErrors(api);
});

export { authApi, documentApi, templateApi }; 