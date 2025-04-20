const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');

const register = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.register(req.body);
    res.status(201).json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);
    res.status(200).json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token is required');
    }
    
    const { user, tokens } = await authService.refreshToken(refreshToken);
    res.status(200).json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw ApiError.badRequest('Email is required');
    }
    
    const resetToken = await authService.forgotPassword(email);
    
    // In a real app, you would send an email with the reset link
    // For the MVP, we'll just return it in the response
    res.status(200).json({ 
      message: 'Password reset link sent to your email',
      // Only for development purposes, remove in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      throw ApiError.badRequest('Token and password are required');
    }
    
    await authService.resetPassword(token, password);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
}; 