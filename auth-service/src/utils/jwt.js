const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('./ApiError');

const generateToken = (userId, expires) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
  };
  return jwt.sign(payload, config.jwt.secret);
};

const generateAuthTokens = async (user) => {
  // Calculate token expiry times
  const accessTokenExpires = Math.floor(Date.now() / 1000) + (config.jwt.accessExpirationMinutes * 60);
  const refreshTokenExpires = Math.floor(Date.now() / 1000) + (config.jwt.refreshExpirationDays * 24 * 60 * 60);
  
  // Generate tokens
  const accessToken = generateToken(user.id, accessTokenExpires);
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  
  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires * 1000),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(refreshTokenExpires * 1000),
    },
  };
};

const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    return payload;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
};

module.exports = {
  generateToken,
  generateAuthTokens,
  verifyToken,
}; 