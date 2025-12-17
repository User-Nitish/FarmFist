const express = require('express');
const { body, validationResult } = require('express-validator');
const Inspection = require('../models/Inspection');
const Farm = require('../models/Farm');
const { auth, isInspector } = require('../middleware/auth');
const axios = require('axios');
const mongoose = require('mongoose');

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

const router = express.Router();

// Get all inspections for the authenticated user (farmer sees their farm inspections, inspector sees all)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'farmer') {
      // Farmers see inspections for their farms
      const farms = await Farm.find({ userId: req.user.userId }).select('_id');
      const farmIds = farms.map(farm => farm._id);
      query.farmId = { $in: farmIds };
    } else if (req.user.role === 'inspector') {
      // Inspectors see inspections they conducted
      query.inspectorId = req.user.userId;
    }

    const inspections = await Inspection.find(query)
      .populate('farmId', 'farmName farmType location')
      .populate('inspectorId', 'name email')
      .sort({ inspectionDate: -1 });

    res.json({ inspections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching inspections' });
  }
});

// Get single inspection by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('farmId', 'farmName farmType location capacity')
      .populate('inspectorId', 'name email');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    // Check if user has permission to view this inspection
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: inspection.farmId._id,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'inspector' && inspection.inspectorId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ inspection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching inspection' });
  }
});

// Helper function to calculate overall score from biosecurity checks
const calculateOverallScore = (biosecurityChecks) => {
  if (!biosecurityChecks) return 0;
  
  const scores = Object.values(biosecurityChecks)
    .filter(check => typeof check?.score === 'number')
    .map(check => check.score);
  
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

// Helper function to determine compliance status
const determineComplianceStatus = (score) => {
  if (score >= 90) return 'compliant';
  if (score >= 70) return 'conditional';
  return 'non_compliant';
};

// Generate AI analysis for inspection
const generateAIAnalysis = async (inspectionData) => {
  try {
    const prompt = `
    You are an expert agricultural inspector. Analyze the following farm inspection data and provide insights:
    
    Inspection Details:
    - Type: ${inspectionData.inspectionType}
    - Date: ${inspectionData.inspectionDate}
    - Overall Score: ${inspectionData.overallScore}/100
    - Compliance Status: ${inspectionData.complianceStatus}
    
    Biosecurity Checks:
    ${JSON.stringify(inspectionData.biosecurityChecks, null, 2)}
    
    Livestock Health:
    ${JSON.stringify(inspectionData.livestockHealth, null, 2)}
    
    Please provide a detailed analysis including:
    1. Risk assessment with level (low/medium/high/critical)
    2. Key findings and observations
    3. Critical issues that need immediate attention
    4. Recommendations for improvement
    5. Prediction for next inspection score if recommendations are followed
    
    Format the response as a JSON object with these exact keys:
    {
      "riskAssessment": {
        "level": "string (low/medium/high/critical)",
        "score": "number (0-100)",
        "summary": "string"
      },
      "anomalyDetection": {
        "detected": "boolean",
        "type": "string (if anomaly detected)",
        "severity": "string (low/medium/high)",
        "description": "string",
        "recommendations": "string[]"
      },
      "compliancePrediction": {
        "nextInspectionScore": "number (0-100)",
        "predictedImprovement": "number",
        "confidence": "number (0-1)"
      },
      "summary": "string (human-readable summary)"
    }
    `;

    const aiResponse = await callGeminiAPI(prompt);
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return {
      error: 'Failed to generate AI analysis',
      details: error.message
    };
  }
};

// Create new inspection with AI analysis (inspectors only)
router.post('/', auth, isInspector, [
  body('farmId').isMongoId().withMessage('Invalid farm ID'),
  body('inspectionDate').isISO8601().withMessage('Invalid date format'),
  body('inspectionType').isIn(['routine', 'emergency', 'follow_up', 'certification']).withMessage('Invalid inspection type'),
  body('biosecurityChecks').optional().isObject().withMessage('Biosecurity checks must be an object'),
  body('livestockHealth').optional().isObject().withMessage('Livestock health data must be an object'),
  body('recommendations').optional().isArray().withMessage('Recommendations must be an array'),
  body('overallScore').optional().isNumeric().withMessage('Overall score must be numeric')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      farmId,
      inspectionDate,
      inspectionType,
      biosecurityChecks,
      livestockHealth,
      recommendations,
      overallScore,
      complianceStatus,
      nextInspectionDate,
      images,
      notes
    } = req.body;

    // Verify farm exists and get details
    const farm = await Farm.findById(farmId).populate('userId', 'name email');
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Calculate overall score if not provided
    const calculatedScore = req.body.overallScore || calculateOverallScore(req.body.biosecurityChecks);
    const complianceStatus = determineComplianceStatus(calculatedScore);
    
    // Create inspection with basic data
    const inspectionData = {
      farmId,
      inspectorId: req.user.userId,
      inspectionDate,
      inspectionType,
      biosecurityChecks,
      livestockHealth,
      recommendations,
      overallScore: calculatedScore,
      complianceStatus,
      nextInspectionDate,
      images,
      notes,
      metadata: {
        createdBy: req.user.userId,
        version: 1
      }
    };

    const inspection = new Inspection(inspectionData);
    
    // Save the inspection first
    await inspection.save();
    
    // Generate AI analysis in the background
    if (process.env.ENABLE_AI_ANALYSIS !== 'false') {
      generateAIAnalysis(inspectionData)
        .then(aiAnalysis => {
          if (!aiAnalysis.error) {
            inspection.aiAnalysis = {
              ...aiAnalysis,
              lastUpdated: new Date()
            };
            return inspection.save();
          }
        })
        .catch(error => {
          console.error('Background AI analysis failed:', error);
        });
    }

    res.status(201).json({ 
      message: 'Inspection created successfully', 
      inspection: {
        ...inspection.toObject(),
        // Don't wait for AI analysis to complete before responding
        aiAnalysis: inspection.aiAnalysis || { status: 'pending' }
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error while creating inspection',
      error: error.message 
    });
  }
});

// Update inspection (only the inspector who created it)
router.put('/:id', auth, isInspector, [
  body('inspectionDate').optional().isISO8601().withMessage('Invalid date format'),
  body('inspectionType').optional().isIn(['routine', 'emergency', 'follow_up', 'certification']).withMessage('Invalid inspection type'),
  body('overallScore').optional().isNumeric().withMessage('Overall score must be numeric')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    const allowedFields = [
      'inspectionDate', 'inspectionType', 'biosecurityChecks',
      'livestockHealth', 'recommendations', 'overallScore',
      'complianceStatus', 'nextInspectionDate', 'images', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const inspection = await Inspection.findOneAndUpdate(
      { _id: req.params.id, inspectorId: req.user.userId },
      updates,
      { new: true, runValidators: true }
    ).populate('farmId', 'farmName farmType location')
     .populate('inspectorId', 'name email');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found or access denied' });
    }

    res.json({ message: 'Inspection updated successfully', inspection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating inspection' });
  }
});

// Delete inspection (only the inspector who created it or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role === 'inspector') {
      query.inspectorId = req.user.userId;
    }
    // Admin can delete any inspection

    const inspection = await Inspection.findOneAndDelete(query);

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found or access denied' });
    }

    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting inspection' });
  }
});

// Get inspections for a specific farm
router.get('/farm/:farmId', auth, async (req, res) => {
  try {
    // Check if user has access to this farm
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: req.params.farmId,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const inspections = await Inspection.find({ farmId: req.params.farmId })
      .populate('inspectorId', 'name email')
      .sort({ inspectionDate: -1 });

    res.json({ inspections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching farm inspections' });
  }
});

// Generate AI analysis for an inspection
router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('farmId', 'farmName farmType location')
      .populate('inspectorId', 'name email');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    // Check permissions
    if (req.user.role === 'farmer' && inspection.farmId.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate AI analysis
    const aiAnalysis = await generateAIAnalysis(inspection.toObject());
    
    // Update inspection with AI analysis
    inspection.aiAnalysis = {
      ...aiAnalysis,
      lastUpdated: new Date()
    };
    
    await inspection.save();

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

// Get inspection statistics for a farm
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

    const stats = await Inspection.aggregate([
      { $match: { farmId: mongoose.Types.ObjectId(farmId) } },
      {
        $group: {
          _id: null,
          totalInspections: { $sum: 1 },
          avgScore: { $avg: '$overallScore' },
          lastInspection: { $max: '$inspectionDate' },
          nextInspection: { $max: '$nextInspectionDate' },
          complianceRate: {
            $avg: {
              $cond: [{ $eq: ['$complianceStatus', 'compliant'] }, 1, 0]
            }
          },
          byType: {
            $push: {
              type: '$inspectionType',
              count: 1,
              avgScore: '$overallScore'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalInspections: 1,
          avgScore: { $round: ['$avgScore', 2] },
          lastInspection: 1,
          nextInspection: 1,
          complianceRate: { $round: [{ $multiply: ['$complianceRate', 100] }, 2] },
          byType: {
            $arrayToObject: {
              $map: {
                input: '$byType',
                as: 'type',
                in: {
                  k: '$$type.type',
                  v: {
                    count: '$$type.count',
                    avgScore: { $round: ['$$type.avgScore', 2] }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({ stats: stats[0] || {} });
  } catch (error) {
    console.error('Error fetching inspection stats:', error);
    res.status(500).json({
      message: 'Failed to fetch inspection statistics',
      error: error.message
    });
  }
});

// Get inspection timeline for a farm
router.get('/timeline/farm/:farmId', auth, async (req, res) => {
  try {
    const { farmId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    // Check if user has access to this farm
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({ _id: farmId, userId: req.user.userId });
      if (!farm) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [inspections, total] = await Promise.all([
      Inspection.find({ farmId })
        .sort({ inspectionDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('inspectorId', 'name email'),
      Inspection.countDocuments({ farmId })
    ]);

    res.json({
      inspections,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inspection timeline:', error);
    res.status(500).json({
      message: 'Failed to fetch inspection timeline',
      error: error.message
    });
  }
});

module.exports = router;
