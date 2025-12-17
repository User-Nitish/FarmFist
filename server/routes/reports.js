const express = require('express');
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const Inspection = require('../models/Inspection');
const Farm = require('../models/Farm');
const { auth, isInspector } = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDYyK5Iuk6PKMgHtkdJ69vi8QBa2DW-iGk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Helper function to call Gemini API
const callGeminiAPI = async (prompt) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
};

// Generate AI-powered report summary
const generateAIReportSummary = async (reportData) => {
  try {
    const prompt = `
    You are an expert agricultural analyst. Analyze the following farm inspection report and provide insights:
    
    Report Title: ${reportData.title}
    Period: ${reportData.startDate} to ${reportData.endDate || 'Present'}
    
    Inspection Summary:
    - Total Inspections: ${reportData.summary?.totalInspections || 0}
    - Average Score: ${reportData.summary?.averageScore || 0}/100
    - Compliance Rate: ${reportData.summary?.complianceRate || 0}%
    
    Key Findings:
    ${JSON.stringify(reportData.findings || [], null, 2)}
    
    Please provide a comprehensive analysis including:
    1. Executive Summary (2-3 sentences)
    2. Key Trends and Patterns
    3. Critical Issues and Risks
    4. Recommendations for Improvement
    5. Future Outlook
    
    Format the response as a JSON object with these exact keys:
    {
      "executiveSummary": "string",
      "trends": ["string"],
      "criticalIssues": ["string"],
      "recommendations": ["string"],
      "futureOutlook": "string"
    }
    `;

    const aiResponse = await callGeminiAPI(prompt);
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error('Error generating AI report summary:', error);
    return {
      error: 'Failed to generate AI analysis',
      details: error.message
    };
  }
};

const router = express.Router();

// Get all reports for the authenticated user with filters
router.get('/', auth, async (req, res) => {
  try {
    const { farmId, startDate, endDate, type } = req.query;
    let query = {};
    
    // Base query based on user role
    if (req.user.role === 'farmer') {
      const farms = await Farm.find({ userId: req.user.userId }).select('_id');
      const farmIds = farms.map(farm => farm._id);
      query.farmId = { $in: farmIds };
    } else if (req.user.role === 'inspector') {
      query.generatedBy = req.user.userId;
    }

    // Apply filters
    if (farmId) {
      query.farmId = mongoose.Types.ObjectId(farmId);
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (type) {
      query.type = type;
    }

    const reports = await Report.find(query)
      .populate('farmId', 'farmName farmType location')
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });

    // Add chart data for the reports list
    const reportsWithCharts = reports.map(report => ({
      ...report.toObject(),
      charts: generateReportCharts(report)
    }));

    res.json({ reports: reportsWithCharts });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      message: 'Server error while fetching reports',
      error: error.message 
    });
  }
});

// Generate chart data for a report
const generateReportCharts = (report) => {
  if (!report || !report.data) return {};
  
  const { data } = report;
  
  // Score distribution chart
  const scoreDistribution = {
    labels: ['0-59', '60-69', '70-84', '85-100'],
    datasets: [{
      label: 'Number of Inspections',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)'
      ]
    }]
  };

  // Compliance trend chart
  const complianceTrend = {
    labels: [],
    datasets: [{
      label: 'Compliance Score',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
      tension: 0.1
    }]
  };

  // Process inspection data for charts
  if (data.inspections && Array.isArray(data.inspections)) {
    data.inspections.forEach(inspection => {
      // Score distribution
      const score = inspection.overallScore || 0;
      if (score < 60) scoreDistribution.datasets[0].data[0]++;
      else if (score < 70) scoreDistribution.datasets[0].data[1]++;
      else if (score < 85) scoreDistribution.datasets[0].data[2]++;
      else scoreDistribution.datasets[0].data[3]++;

      // Compliance trend
      if (inspection.inspectionDate) {
        complianceTrend.labels.push(new Date(inspection.inspectionDate).toLocaleDateString());
        complianceTrend.datasets[0].data.push(score);
      }
    });
  }

  return {
    scoreDistribution,
    complianceTrend,
    // Add more chart data as needed
  };
};

// Get a single report by ID with detailed data
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('farmId', 'farmName farmType location')
      .populate('generatedBy', 'name email')
      .populate('data.inspections.inspectorId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has access to this report
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: report.farmId,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Generate charts for the report
    const reportWithCharts = {
      ...report.toObject(),
      charts: generateReportCharts(report)
    };

    res.json({ report: reportWithCharts });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ 
      message: 'Server error while fetching report',
      error: error.message 
    });
  }
});

// Generate AI analysis for a report
router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('farmId', 'farmName farmType location')
      .populate('generatedBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && report.farmId.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate AI analysis
    const aiAnalysis = await generateAIReportSummary(report.toObject());
    
    // Update report with AI analysis
    report.aiAnalysis = {
      ...aiAnalysis,
      lastUpdated: new Date()
    };
    
    await report.save();

    res.json({
      message: 'AI analysis generated successfully',
      analysis: aiAnalysis
    });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({
      message: 'Failed to generate AI analysis',
      error: error.message
    });
  }
});

// Export report as PDF (placeholder)
router.get('/:id/export/pdf', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: report.farmId,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // In a real implementation, you would generate a PDF here
    // For now, we'll return a success message
    res.json({
      message: 'PDF export initiated',
      status: 'pending',
      downloadUrl: `/api/reports/${report._id}/download/pdf`
    });
  } catch (error) {
    console.error('Error exporting report to PDF:', error);
    res.status(500).json({
      message: 'Failed to export report to PDF',
      error: error.message
    });
  }
});

// Get report statistics
router.get('/stats/farm/:farmId', auth, async (req, res) => {
  try {
    const { farmId } = req.params;
    
    // Check if user has access to this farm
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({ _id: farmId, userId: req.user.userId });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const stats = await Report.aggregate([
      { $match: { farmId: mongoose.Types.ObjectId(farmId) } },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          byType: {
            $push: {
              type: '$type',
              count: 1
            }
          },
          lastReport: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          _id: 0,
          totalReports: 1,
          lastReport: 1,
          byType: {
            $arrayToObject: {
              $map: {
                input: '$byType',
                as: 'type',
                in: {
                  k: '$$type.type',
                  v: '$$type.count'
                }
              }
            }
          }
        }
      }
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (error) {
    console.error('Error fetching report stats:', error);
    res.status(500).json({
      message: 'Failed to fetch report statistics',
      error: error.message
    });
  }
});

// Create a new report with AI-powered analysis
router.post('/', auth, isInspector, [
  body('farmId').isMongoId().withMessage('Invalid farm ID'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('startDate').optional().isISO8601().withMessage('Invalid start date format'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('type').isIn(['monthly', 'quarterly', 'annual', 'custom']).withMessage('Invalid report type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { farmId, title, description, startDate, endDate, type } = req.body;

    // Verify farm exists and user has access
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (req.user.role === 'farmer' && farm.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get inspections for the report period with detailed population
    const query = { farmId };
    if (startDate) query.inspectionDate = { $gte: new Date(startDate) };
    if (endDate) {
      query.inspectionDate = query.inspectionDate || {};
      query.inspectionDate.$lte = new Date(endDate);
    }

    const inspections = await Inspection.find(query)
      .populate('inspectorId', 'name email')
      .populate('farmId', 'farmName farmType location')
      .sort({ inspectionDate: -1 });

    if (inspections.length === 0) {
      return res.status(400).json({ message: 'No inspection data found for the selected period' });
    }

    // Generate comprehensive report data
    const reportData = {
      title,
      description,
      farmId,
      type,
      generatedBy: req.user.userId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      data: {
        inspections: inspections.map(i => i.toObject()),
        summary: await generateReportSummary(inspections),
        findings: generateFindings(inspections),
        statistics: await generateInspectionStatistics(inspections),
        charts: generateChartData(inspections)
      },
      metadata: {
        generatedAt: new Date(),
        generatedBy: req.user.userId,
        inspectionCount: inspections.length,
        version: '1.0'
      }
    };

    // Create the report first
    const report = new Report(reportData);
    await report.save();

    // Generate AI analysis in the background
    if (process.env.ENABLE_AI_ANALYSIS !== 'false') {
      generateAIReportSummary(reportData)
        .then(aiAnalysis => {
          if (!aiAnalysis.error) {
            report.aiAnalysis = aiAnalysis;
            return report.save();
          }
        })
        .catch(error => {
          console.error('Background AI analysis failed:', error);
        });
    }

    res.status(201).json({ 
      message: 'Report generated successfully', 
      report: {
        ...report.toObject(),
        // Don't wait for AI analysis to complete before responding
        aiAnalysis: report.aiAnalysis || { status: 'pending' }
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      message: 'Server error while generating report',
      error: error.message 
    });
  }
});

// Generate inspection statistics
const generateInspectionStatistics = async (inspections) => {
  if (!inspections || inspections.length === 0) return {};

  const scores = inspections.map(i => i.overallScore || 0);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  const complianceCounts = {
    compliant: 0,
    conditional: 0,
    non_compliant: 0
  };

  const typeCounts = {};
  const inspectorCounts = {};

  inspections.forEach(inspection => {
    // Count compliance status
    if (inspection.complianceStatus) {
      complianceCounts[inspection.complianceStatus] = 
        (complianceCounts[inspection.complianceStatus] || 0) + 1;
    }

    // Count by inspection type
    if (inspection.inspectionType) {
      typeCounts[inspection.inspectionType] = 
        (typeCounts[inspection.inspectionType] || 0) + 1;
    }

    // Count by inspector
    if (inspection.inspectorId && inspection.inspectorId.name) {
      const inspectorName = inspection.inspectorId.name;
      inspectorCounts[inspectorName] = 
        (inspectorCounts[inspectorName] || 0) + 1;
    }
  });

  // Calculate compliance rate
  const totalInspections = inspections.length;
  const complianceRate = (complianceCounts.compliant / totalInspections) * 100;

  // Get date range
  const sortedInspections = [...inspections].sort(
    (a, b) => new Date(a.inspectionDate) - new Date(b.inspectionDate)
  );
  const dateRange = {
    start: sortedInspections[0]?.inspectionDate,
    end: sortedInspections[sortedInspections.length - 1]?.inspectionDate
  };

  return {
    totalInspections,
    avgScore: parseFloat(avgScore.toFixed(2)),
    complianceRate: parseFloat(complianceRate.toFixed(2)),
    complianceCounts,
    typeCounts,
    inspectorCounts,
    dateRange
  };
};

// Generate chart data for the report
const generateChartData = (inspections) => {
  if (!inspections || inspections.length === 0) return {};

  // Score trend over time
  const scoreTrend = {
    labels: [],
    datasets: [{
      label: 'Inspection Score',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
      tension: 0.1
    }]
  };

  // Compliance status distribution
  const complianceData = {
    labels: ['Compliant', 'Conditional', 'Non-Compliant'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ]
    }]
  };

  // Inspection type distribution
  const typeData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)'
      ]
    }]
  };

  // Process data for charts
  const typeCounts = {};
  const complianceCounts = { compliant: 0, conditional: 0, non_compliant: 0 };

  inspections.forEach(inspection => {
    // Score trend
    if (inspection.inspectionDate) {
      const date = new Date(inspection.inspectionDate);
      scoreTrend.labels.push(date.toLocaleDateString());
      scoreTrend.datasets[0].data.push(inspection.overallScore || 0);
    }

    // Compliance status
    if (inspection.complianceStatus) {
      complianceCounts[inspection.complianceStatus]++;
    }

    // Inspection types
    if (inspection.inspectionType) {
      typeCounts[inspection.inspectionType] = 
        (typeCounts[inspection.inspectionType] || 0) + 1;
    }
  });

  // Update compliance data
  complianceData.datasets[0].data = [
    complianceCounts.compliant || 0,
    complianceCounts.conditional || 0,
    complianceCounts.non_compliant || 0
  ];

  // Update type data
  typeData.labels = Object.keys(typeCounts);
  typeData.datasets[0].data = Object.values(typeCounts);

  return {
    scoreTrend,
    complianceData,
    typeData
  };
};

// Update report
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('summary').optional().trim().isLength({ min: 10 }).withMessage('Summary must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    const allowedFields = [
      'title', 'period', 'summary', 'keyFindings', 'biosecurityMetrics',
      'healthMetrics', 'recommendations', 'aiInsights', 'charts',
      'attachments', 'status'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Find the report first to check permissions
    const existingReport = await Report.findById(req.params.id);
    if (!existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && existingReport.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('farmId', 'farmName farmType location')
     .populate('userId', 'name email');

    res.json({ message: 'Report updated successfully', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating report' });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && report.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting report' });
  }
});

// Get reports for a specific farm
router.get('/farm/:farmId', auth, async (req, res) => {
  try {
    // Check access permissions
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: req.params.farmId,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const reports = await Report.find({ farmId: req.params.farmId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching farm reports' });
  }
});

// Generate report from inspection
router.post('/from-inspection/:inspectionId', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.inspectionId)
      .populate('farmId', 'farmName farmType location')
      .populate('inspectorId', 'name email');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && inspection.farmId.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate report from inspection data
    const reportData = {
      title: `${inspection.inspectionType} Inspection Report - ${new Date().toLocaleDateString()}`,
      reportType: 'inspection_report',
      farmId: inspection.farmId._id,
      inspectionId: inspection._id,
      period: {
        start: inspection.inspectionDate,
        end: new Date()
      },
      keyFindings: [
        `Overall Score: ${inspection.overallScore}/100`,
        `Compliance Status: ${inspection.complianceStatus}`,
        `Inspection Type: ${inspection.inspectionType}`
      ],
      biosecurityMetrics: inspection.biosecurityChecks,
      healthMetrics: inspection.livestockHealth,
      recommendations: inspection.recommendations,
      metadata: {
        generatedFromInspection: true,
        inspectionDate: inspection.inspectionDate,
        inspector: inspection.inspectorId.name
      }
    };

    // Add AI analysis if available
    if (inspection.aiAnalysis) {
      reportData.aiInsights = {
        riskAssessment: inspection.aiAnalysis.riskAssessment,
        anomalyDetection: inspection.aiAnalysis.anomalyDetection,
        compliancePrediction: inspection.aiAnalysis.compliancePrediction,
        generatedAt: new Date()
      };
    }

    // Create the report
    const report = new Report({
      ...reportData,
      userId: req.user.userId,
      metadata: {
        ...reportData.metadata,
        generatedWithAI: !!inspection.aiAnalysis,
        version: 1
      }
    });

    await report.save();

    // Update inspection to mark report as generated
    inspection.reportGenerated = true;
    await inspection.save();

    res.status(201).json({
      message: 'Report generated successfully',
      report: {
        id: report._id,
        title: report.title,
        type: report.reportType,
        createdAt: report.createdAt,
        hasAIInsights: !!report.aiInsights
      }
    });
  } catch (error) {
    console.error('Error generating report from inspection:', error);
    res.status(500).json({ 
      message: 'Failed to generate report from inspection',
      error: error.message 
    });
  }
});

// Export report in different formats
router.get('/export/:id/:format', auth, async (req, res) => {
  try {
    const { id, format } = req.params;
    
    if (!['pdf', 'csv', 'json'].includes(format)) {
      return res.status(400).json({ message: 'Unsupported export format' });
    }

    const report = await Report.findById(id)
      .populate('farmId', 'farmName farmType location')
      .populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && report.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let exportedData;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `report-${report._id}-${timestamp}.${format}`;

    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.json(report);

      case 'csv':
        // Simple CSV conversion (in a real app, use a library like json2csv)
        const { farmId, userId, ...reportData } = report.toObject();
        const csvRows = [];
        
        // Flatten the object for CSV
        const flattenObject = (obj, prefix = '') => {
          return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object' && obj[k] !== null) {
              Object.assign(acc, flattenObject(obj[k], pre + k));
            } else {
              acc[pre + k] = obj[k];
            }
            return acc;
          }, {});
        };

        const flatReport = flattenObject(reportData);
        const headers = Object.keys(flatReport);
        const values = headers.map(header => 
          typeof flatReport[header] === 'string' 
            ? `"${flatReport[header].replace(/"/g, '""')}"` 
            : flatReport[header]
        );
        
        csvRows.push(headers.join(','));
        csvRows.push(values.join(','));
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(csvRows.join('\n'));

      case 'pdf':
      default:
        // In a real app, use a PDF generation library like pdfkit or puppeteer
        return res.status(501).json({ 
          message: 'PDF export not yet implemented',
          suggestion: 'Export as JSON or CSV for now'
        });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      message: 'Failed to export report',
      error: error.message 
    });
  }
});

// Get report statistics
router.get('/stats/farm/:farmId', auth, async (req, res) => {
  try {
    const { farmId } = req.params;
    
    // Check if user has access to this farm
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({ _id: farmId, userId: req.user.userId });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const stats = await Report.aggregate([
      { $match: { farmId: mongoose.Types.ObjectId(farmId) } },
      {
        $group: {
          _id: '$reportType',
          count: { $sum: 1 },
          latestDate: { $max: '$createdAt' },
          avgScore: { 
            $avg: {
              $cond: [
                { $ifNull: ['$aiInsights.riskAssessment.score', false] },
                '$aiInsights.riskAssessment.score',
                null
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching report stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch report statistics',
      error: error.message 
    });
  }
});

module.exports = router;
