const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  inspectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inspectionDate: {
    type: Date,
    required: true
  },
  inspectionType: {
    type: String,
    enum: ['routine', 'emergency', 'follow_up', 'certification'],
    required: true
  },
  biosecurityChecks: {
    perimeterSecurity: {
      score: { type: Number, min: 0, max: 10 },
      notes: String,
      compliant: Boolean
    },
    accessControl: {
      score: { type: Number, min: 0, max: 10 },
      notes: String,
      compliant: Boolean
    },
    quarantineFacility: {
      score: { type: Number, min: 0, max: 10 },
      notes: String,
      compliant: Boolean
    },
    wasteManagement: {
      score: { type: Number, min: 0, max: 10 },
      notes: String,
      compliant: Boolean
    },
    disinfection: {
      score: { type: Number, min: 0, max: 10 },
      notes: String,
      compliant: Boolean
    },
    pestControl: {
      score: { type: Number, min: 0, max: 10 },
      notes: String,
      compliant: Boolean
    }
  },
  livestockHealth: {
    overallHealth: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    vaccinationStatus: {
      type: String,
      enum: ['up_to_date', 'partial', 'overdue', 'none'],
      required: true
    },
    diseaseSigns: [{
      disease: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] },
      affectedAnimals: Number
    }],
    mortalityRate: Number,
    feedQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    }
  },
  recommendations: [{
    category: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    description: String,
    timeline: String
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  complianceStatus: {
    type: String,
    enum: ['compliant', 'non_compliant', 'conditional'],
    required: true
  },
  nextInspectionDate: Date,
  reportGenerated: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
inspectionSchema.pre('save', function(next) {
  try {
    this.updatedAt = new Date();
    if (typeof next === 'function') {
      return next();
    }
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    if (typeof next === 'function') {
      return next(error);
    }
  }
});

module.exports = mongoose.model('Inspection', inspectionSchema);
