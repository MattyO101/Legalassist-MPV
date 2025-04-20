const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(ApiError.badRequest(errorMessage));
  }
  
  return next();
};

module.exports = validate; 