const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Unauthorized access');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw ApiError.unauthorized('Access token not provided');
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // For the template service, we just need the user id
    req.user = { id: decoded.sub };
    
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