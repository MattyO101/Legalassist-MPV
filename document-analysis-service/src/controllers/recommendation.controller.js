const analysisService = require('../services/analysis.service');
const ApiError = require('../utils/ApiError');

const getDocumentRecommendations = async (req, res, next) => {
  try {
    const recommendations = await analysisService.getDocumentRecommendations(
      req.params.documentId,
      req.user.id
    );
    res.status(200).json({ recommendations });
  } catch (error) {
    next(error);
  }
};

const applyRecommendation = async (req, res, next) => {
  try {
    const recommendation = await analysisService.updateRecommendationStatus(
      req.params.id,
      req.user.id,
      'accepted'
    );
    res.status(200).json({ recommendation });
  } catch (error) {
    next(error);
  }
};

const rejectRecommendation = async (req, res, next) => {
  try {
    const recommendation = await analysisService.updateRecommendationStatus(
      req.params.id,
      req.user.id,
      'rejected'
    );
    res.status(200).json({ recommendation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocumentRecommendations,
  applyRecommendation,
  rejectRecommendation,
}; 