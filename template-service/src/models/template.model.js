const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['contract', 'agreement', 'letter', 'form', 'policy', 'other'],
      index: true,
    },
    fields: [{
      name: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'date', 'select', 'checkbox'],
      },
      options: [String], // For select fields
      required: {
        type: Boolean,
        default: false,
      },
      defaultValue: String,
      placeholder: String,
      description: String,
    }],
    content: {
      type: String,
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

// Update the updatedAt field on save
templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template; 