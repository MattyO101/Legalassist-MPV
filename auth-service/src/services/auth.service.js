const crypto = require('crypto');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { generateAuthTokens, verifyToken } = require('../utils/jwt');

const register = async (userData) => {
  if (await User.findOne({ email: userData.email })) {
    throw ApiError.badRequest('Email already taken');
  }

  const user = await User.create(userData);
  const tokens = await generateAuthTokens(user);

  return { user, tokens };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user || !(await user.isPasswordMatch(password))) {
    throw ApiError.unauthorized('Incorrect email or password');
  }
  
  const tokens = await generateAuthTokens(user);
  
  return { user, tokens };
};

const refreshToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken);
    const user = await User.findById(refreshTokenDoc.sub);
    
    if (!user) {
      throw new Error();
    }
    
    const tokens = await generateAuthTokens(user);
    
    return { user, tokens };
  } catch (error) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw ApiError.notFound('No account found with that email address');
  }
  
  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token for storage
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set reset token and expiration
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  
  // Return original unhashed token for email sending
  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  // Hash the received token to compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  
  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }
  
  // Update password and clear reset fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  
  return user;
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
}; 