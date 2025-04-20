const mongoose = require('mongoose');

const userTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Object, // JSON object with field values
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for userId and templateId
userTemplateSchema.index({ userId: 1, templateId: 1 });

const UserTemplate = mongoose.model('UserTemplate', userTemplateSchema);

module.exports = UserTemplate; 