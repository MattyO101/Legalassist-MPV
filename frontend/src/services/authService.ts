import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get the auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Add token to request headers if it exists
const authHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Login user
const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data.user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

// Register a new user
const register = async (userData: { email: string; password: string; name: string }): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data.user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
};

// Logout - clear local storage
const logout = (): void => {
  localStorage.removeItem('token');
};

// Get current authenticated user
const getCurrentUser = async (): Promise<any> => {
  try {
    const token = getToken();
    
    if (!token) {
      return null;
    }
    
    const response = await axios.get(`${API_URL}/auth/me`, { 
      headers: authHeader() 
    });
    
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getToken
};

export const getProfile = async (): Promise<AuthResponse> => {
  const response = await axios.get(`${API_URL}/auth/me`, { 
    headers: authHeader() 
  });
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
  
  // Update access token in localStorage
  localStorage.setItem('token', response.data.token);
  
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
  return response.data;
}; 