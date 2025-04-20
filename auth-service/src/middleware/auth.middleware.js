const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Please authenticate');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw ApiError.unauthorized('Please authenticate');
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Find user by id
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }
    
    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    next(error);
  }
};

module.exports = auth; 