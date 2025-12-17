// server/models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ['production_summary', 'health_report', 'biosecurity_audit', 'financial_report', 'compliance_report', 'risk_assessment', 'ai_insights'],
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'generated'],
    default: 'pending'
  },
  parameters: {
    startDate: Date,
    endDate: Date,
    includeDetails: Boolean
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  insights: {
    summary: String,
    key_metrics: [String],
    risks: [{
      risk: String,
      severity: String,
      recommendation: String
    }],
    recommendations: [String]
  },
  fileUrl: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search
ReportSchema.index({ 
  title: 'text', 
  'data.summary': 'text',
  'insights.summary': 'text'
});

module.exports = mongoose.model('Report', ReportSchema);[]