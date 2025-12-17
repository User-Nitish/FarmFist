const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['biosecurity_audit', 'health_report', 'compliance_report', 'risk_assessment'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  summary: {
    type: String,
    required: true
  },
  keyFindings: [{
    category: String,
    finding: String,
    severity: { type: String, enum: ['critical', 'high', 'medium', 'low'] },
    recommendation: String
  }],
  biosecurityMetrics: {
    overallScore: Number,
    complianceRate: Number,
    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    improvementAreas: [String]
  },
  healthMetrics: {
    mortalityRate: Number,
    diseaseIncidence: Number,
    vaccinationCoverage: Number,
    feedConversionRatio: Number
  },
  recommendations: [{
    category: String,
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    action: String,
    timeline: String,
    responsible: String
  }],
  aiInsights: {
    summary: String,
    risks: [String],
    opportunities: [String],
    predictions: [String]
  },
  charts: [{
    type: String,
    data: mongoose.Schema.Types.Mixed,
    title: String
  }],
  generatedBy: {
    type: String,
    enum: ['system', 'inspector', 'ai'],
    default: 'system'
  },
  status: {
    type: String,
    enum: ['draft', 'final', 'archived'],
    default: 'draft'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
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
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
