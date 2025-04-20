const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['addition', 'deletion', 'modification', 'information'],
    },
    content: {
      type: String,
      required: true,
    },
    originalText: {
      type: String,
    },
    suggestedText: {
      type: String,
    },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation; 