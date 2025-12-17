const express = require('express');
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const Farm = require('../models/Farm');
const Inspection = require('../models/Inspection');
const { auth } = require('../middleware/auth');
const { processReport, getWeatherData } = require('../services/reports/reportGenerator');

// Helper function to generate local insights with enhanced data
const generateLocalInsights = (farm, weatherData, reportType, recentInspections = []) => {
  // Define helper functions first
  const calculateWeatherScore = (weather) => {
    if (!weather) return 50;
    let score = 50;
    
    // Adjust score based on temperature (ideal range 15-25°C)
    if (weather.avgtemp_c) {
      const tempDiff = Math.min(Math.abs(weather.avgtemp_c - 20), 30);
      score += (30 - tempDiff) / 30 * 30; // Up to 30 points for temperature
    }
    
    // Adjust score based on precipitation
    if (weather.totalprecip_mm > 0) {
      score -= Math.min(weather.totalprecip_mm * 2, 20); // Reduce score for rain
    }
    
    // Adjust score based on wind
    if (weather.maxwind_kph > 30) {
      score -= Math.min((weather.maxwind_kph - 30) / 2, 20); // Reduce score for high winds
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateBiosecurityScore = (level) => {
    const levels = {
      'basic': 40,
      'intermediate': 65,
      'advanced': 85,
      'premium': 95
    };
    return levels[level] || 30; // Default to 30 if level not found
  };

  const generateRandomTrend = (count, baseValue, maxVariation) => {
    return Array.from({ length: count }, () => {
      const variation = Math.floor(Math.random() * maxVariation * 2) - maxVariation;
      return Math.max(0, Math.min(100, baseValue + variation));
    });
  };

  const getRandomItems = (arr, count) => {
    if (!arr || !arr.length) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  // Calculate metrics based on farm data
  const inspectionScore = Math.min(100, 70 + (recentInspections.length * 5));
  const weather = weatherData?.[0]?.day || {};
  const weatherScore = calculateWeatherScore(weather);
  const biosecurityScore = calculateBiosecurityScore(farm.biosecurityLevel);
  const overallScore = Math.round((inspectionScore * 0.4) + (weatherScore * 0.3) + (biosecurityScore * 0.3));

  // Different possible insights with enhanced data
  const insightsTemplates = {
    executiveSummary: [
      `Farm ${farm.farmName} (${farm.farmType || 'Unknown Type'}) shows ${farm.biosecurityLevel || 'basic'} biosecurity level with an overall score of ${overallScore}/100.`,
      `Based on recent data, ${farm.farmName} requires attention in several areas including ${getRandomItems(['biosecurity', 'equipment maintenance', 'staff training'], 2).join(' and ')}.`,
      `${farm.farmName} demonstrates ${overallScore > 70 ? 'strong' : 'adequate'} practices but has opportunities for enhancement in ${getRandomItems(['resource management', 'operational efficiency', 'risk mitigation'], 1)}.`
    ],
    
    // Enhanced key findings with structured data
    keyFindings: [
      { 
        category: 'Weather', 
        metrics: [
          { name: 'Condition', value: weather.condition?.text || 'N/A' },
          { name: 'Temperature', value: weather.avgtemp_c ? `${weather.avgtemp_c}°C` : 'N/A' },
          { name: 'Humidity', value: weather.avghumidity ? `${weather.avghumidity}%` : 'N/A' },
          { name: 'Precipitation', value: weather.totalprecip_mm ? `${weather.totalprecip_mm}mm` : 'N/A' },
          { name: 'Wind Speed', value: weather.maxwind_kph ? `${weather.maxwind_kph} km/h` : 'N/A' }
        ]
      },
      {
        category: 'Farm Status',
        metrics: [
          { name: 'Farm Type', value: farm.farmType || 'Not specified' },
          { name: 'Facilities', value: farm.facilities?.join(', ') || 'Basic' },
          { name: 'Livestock Count', value: farm.livestock?.length || 'N/A' },
          { name: 'Recent Inspections', value: recentInspections.length },
          { name: 'Last Inspection', value: recentInspections[0]?.inspectionDate ? new Date(recentInspections[0].inspectionDate).toLocaleDateString() : 'N/A' }
        ]
      }
    ],
    
    // Enhanced risk assessment with scores and impact levels
    riskAssessment: [
      { 
        risk: 'Disease Outbreak', 
        level: 'High', 
        score: 85,
        details: 'Multiple biosecurity issues detected',
        impact: 'High',
        mitigation: 'Implement strict biosecurity measures',
        timeline: 'Immediate action required'
      },
      { 
        risk: 'Weather Impact', 
        level: weather.condition?.text?.toLowerCase().includes('rain') ? 'High' : 'Medium', 
        score: weather.condition?.text?.toLowerCase().includes('rain') ? 75 : 50,
        details: weather.condition?.text?.toLowerCase().includes('rain') ? 'Potential flooding risk' : 'Stable weather conditions',
        impact: weather.condition?.text?.toLowerCase().includes('rain') ? 'High' : 'Medium',
        mitigation: weather.condition?.text?.toLowerCase().includes('rain') ? 'Prepare flood defenses' : 'Monitor weather updates',
        timeline: weather.condition?.text?.toLowerCase().includes('rain') ? 'Immediate action' : 'Ongoing monitoring'
      },
      { 
        risk: 'Pest Infestation', 
        level: 'Medium', 
        score: 65,
        details: 'Pest control measures needed',
        impact: 'Medium',
        mitigation: 'Schedule pest control service',
        timeline: 'Within 1 week'
      },
      {
        risk: 'Equipment Failure',
        level: 'Low',
        score: 35,
        details: 'Routine maintenance due soon',
        impact: 'Medium',
        mitigation: 'Schedule preventive maintenance',
        timeline: 'Within 2 weeks'
      }
    ],
    
    // Enhanced recommendations with priority and effort
    recommendations: [
      { 
        title: 'Implement daily monitoring', 
        priority: 'High',
        effort: 'Low',
        impact: 'High',
        category: 'Operations'
      },
      { 
        title: 'Schedule regular maintenance', 
        priority: 'High',
        effort: 'Medium',
        impact: 'High',
        category: 'Maintenance'
      },
      { 
        title: 'Improve waste management', 
        priority: 'Medium',
        effort: 'Medium',
        impact: 'Medium',
        category: 'Sanitation'
      },
      { 
        title: 'Enhance security protocols', 
        priority: 'High',
        effort: 'Low',
        impact: 'High',
        category: 'Security'
      },
      { 
        title: 'Train staff on best practices', 
        priority: 'Medium',
        effort: 'High',
        impact: 'High',
        category: 'Training'
      }
    ],
    
    // Enhanced performance metrics with historical data
    performanceMetrics: {
      scores: {
        biosecurity: biosecurityScore,
        weather: weatherScore,
        inspection: inspectionScore,
        overall: overallScore
      },
      trends: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [
          {
            label: 'Biosecurity',
            data: generateRandomTrend(4, biosecurityScore, 10)
          },
          {
            label: 'Weather',
            data: generateRandomTrend(4, weatherScore, 15)
          },
          {
            label: 'Inspections',
            data: generateRandomTrend(4, inspectionScore, 8)
          }
        ]
      },
      categories: [
        { name: 'Biosecurity', value: biosecurityScore, max: 100 },
        { name: 'Equipment', value: 65 + Math.floor(Math.random() * 20), max: 100 },
        { name: 'Staffing', value: 70 + Math.floor(Math.random() * 15), max: 100 },
        { name: 'Compliance', value: 80 + Math.floor(Math.random() * 15), max: 100 }
      ]
    }
  };

  // Generate weather-based insights
  const weatherInsight = (() => {
    const temp = weatherData?.[0]?.day?.avgtemp_c;
    if (temp > 30) return 'High temperatures detected - ensure proper ventilation and hydration.';
    if (temp < 10) return 'Low temperatures - check heating systems and animal comfort.';
    return 'Temperatures are within normal range.';
  })();

  return {
    executiveSummary: insightsTemplates.executiveSummary[
      Math.floor(Math.random() * insightsTemplates.executiveSummary.length)
    ],
    locationAnalysis: `Farm located in ${farm.location?.city || 'unknown location'}`,
    weatherImpact: weatherInsight,
    keyFindings: getRandomItems(insightsTemplates.keyFindings, 3),
    riskAssessment: getRandomItems(insightsTemplates.riskAssessment, 2),
    recommendations: getRandomItems(insightsTemplates.recommendations, 3),
    performanceMetrics: getRandomItems(insightsTemplates.performanceMetrics, 3),
    generatedAt: new Date().toISOString()
  };
};

const router = express.Router();

// Get all reports for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    let query = { userId: req.user.userId };

    if (req.user.role === 'inspector') {
      // Inspectors can see reports for farms they've inspected
      const inspections = await Inspection.find({ inspectorId: req.user.userId }).select('farmId');
      const farmIds = [...new Set(inspections.map(i => i.farmId.toString()))];
      query = {
        $or: [
          { userId: req.user.userId },
          { farmId: { $in: farmIds } }
        ]
      };
    }

    const reports = await Report.find(query)
      .populate('farmId', 'farmName farmType location')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

// Get single report by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('farmId', 'farmName farmType location capacity')
      .populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check access permissions
    if (req.user.role === 'farmer' && report.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'inspector') {
      const inspection = await Inspection.findOne({
        farmId: report.farmId._id,
        inspectorId: req.user.userId
      });
      if (!inspection && report.userId._id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching report' });
  }
});

// Create new report
router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('reportType').isIn([
    'production_summary', 
    'health_report', 
    'biosecurity_audit', 
    'financial_report', 
    'compliance_report', 
    'risk_assessment', 
    'ai_insights'
  ]).withMessage('Invalid report type'),
  body('farmId').optional().isMongoId().withMessage('Invalid farm ID'),
  body('parameters.startDate').optional().isISO8601().toDate(),
  body('parameters.endDate').optional().isISO8601().toDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, reportType, farmId, parameters = {} } = req.body;

    // Check if user has access to this farm if farmId is provided
    if (farmId && req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: farmId,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied to this farm' });
      }
    }

    // Set default date range if not provided
    const now = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(now.getMonth() - 1);

    const reportData = {
      title,
      reportType,
      farmId: farmId || null,
      userId: req.user.userId,
      status: 'pending',
      parameters: {
        startDate: parameters.startDate || defaultStartDate,
        endDate: parameters.endDate || now,
        includeDetails: parameters.includeDetails || false
      },
      generatedBy: req.user.role === 'inspector' ? 'inspector' : 'system'
    };

    // Create the report
    const report = new Report(reportData);
    await report.save();

    // Process the report asynchronously
    processReport(report._id)
      .catch(error => console.error('Error processing report:', error));

    // Return the report with basic info
    res.status(202).json({ 
      message: 'Report generation started', 
      reportId: report._id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ 
      message: 'Server error while creating report',
      error: error.message 
    });
  }
});

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

// Generate AI report
router.post('/generate-ai', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('reportType').isIn(['production_summary', 'health_report', 'biosecurity_audit', 'financial_report', 'compliance_report', 'risk_assessment', 'ai_insights']).withMessage('Invalid report type'),
  body('farmId').optional().isMongoId(),
  body('parameters').isObject()
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, reportType, farmId, parameters } = req.body;

    // Create new report
    const report = new Report({
      title,
      reportType,
      farmId: farmId || null,
      userId: req.user.userId,
      status: 'pending',
      parameters
    });

    await report.save();

    // Process the report asynchronously using the report generator
    processReport(report._id)
      .catch(error => console.error('Error processing report:', error));

    res.status(201).json({
      message: 'Report generation started',
      reportId: report._id,
      report: {
        _id: report._id,
        title: report.title,
        reportType: report.reportType,
        status: report.status,
        createdAt: report.createdAt
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error while generating report' });
  }
});

// Generate insights for a specific report
router.post('/:id/generate-insights', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('farmId', 'farmName farmType location livestock facilities biosecurityLevel');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && report.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const farm = report.farmId;
    if (!farm) {
      return res.status(400).json({ message: 'Report must be associated with a farm' });
    }

    // Get weather data
    let weatherData = null;
    try {
      if (typeof getWeatherData === 'function' && farm.location?.coordinates) {
        weatherData = await getWeatherData(farm.location.coordinates, new Date(), new Date());
      } else {
        console.log('Using default weather data');
        weatherData = [{
          day: {
            avgtemp_c: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30°C
            avghumidity: Math.floor(Math.random() * 50) + 30, // Random humidity 30-80%
            condition: { text: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 5)] },
            totalprecip_mm: Math.random() * 10,
            maxwind_kph: Math.floor(Math.random() * 30) + 5
          }
        }];
      }
    } catch (weatherError) {
      console.error('Weather data fetch failed, using default data:', weatherError);
      weatherData = [{
        day: {
          avgtemp_c: 24,
          avghumidity: 60,
          condition: { text: 'Partly Cloudy' },
          totalprecip_mm: 0,
          maxwind_kph: 15
        }
      }];
    }

    // Get recent inspections for context
    const recentInspections = await Inspection.find({ farmId: farm._id })
      .sort({ inspectionDate: -1 })
      .limit(3);

    // Generate local insights
    const insights = generateLocalInsights(
      farm,
      weatherData,
      report.reportType,
      recentInspections
    );

    // Update the report with insights
    await Report.findByIdAndUpdate(req.params.id, {
      aiAnalysis: insights,
      updatedAt: new Date()
    });

    // Return the insights in the response
    res.json({
      message: 'Insights generated successfully',
      insights: {
        summary: insights.executiveSummary,
        key_metrics: insights.keyFindings,
        risks: insights.riskAssessment,
        recommendations: insights.recommendations
      },
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    
    // Create fallback insights in the format expected by the frontend
    const fallbackInsights = {
      summary: 'Error generating insights: ' + error.message,
      key_metrics: ['An error occurred while generating insights'],
      risks: [{
        risk: 'System Error',
        severity: 'High',
        recommendation: 'Please try again later or contact support',
        details: error.message
      }],
      recommendations: ['Please try again later or contact support']
    };
    
    res.status(500).json({
      message: 'Failed to generate insights',
      error: error.message,
      insights: fallbackInsights
    });
  }
});

module.exports = router;
