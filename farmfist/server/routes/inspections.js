const express = require('express');
const { body, validationResult } = require('express-validator');
const Inspection = require('../models/Inspection');
const Farm = require('../models/Farm');
const { auth, isInspector } = require('../middleware/auth');

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

    // Find inspections with populated data
    const inspections = await Inspection.find(query)
      .populate({
        path: 'farmId',
        select: 'farmName farmType location'
      })
      .populate({
        path: 'inspectorId',
        select: 'name email'
      })
      .sort({ inspectionDate: -1 });

    res.json({ 
      success: true,
      inspections: inspections.map(inspection => ({
        ...inspection.toObject(),
        farmName: inspection.farmId?.farmName || 'N/A',
        inspectorName: inspection.inspectorId?.name || 'Unknown',
        status: inspection.status || 'scheduled'
      }))
    });
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching inspections',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single inspection by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate({
        path: 'farmId',
        select: 'farmName farmType location capacity'
      })
      .populate({
        path: 'inspectorId',
        select: 'name email'
      });

    if (!inspection) {
      return res.status(404).json({ 
        success: false,
        message: 'Inspection not found' 
      });
    }

    // Check if user has permission to view this inspection
    if (req.user.role === 'farmer') {
      const farm = await Farm.findOne({
        _id: inspection.farmId?._id,
        userId: req.user.userId
      });
      if (!farm) {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }
    } else if (req.user.role === 'inspector' && inspection.inspectorId?._id.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    res.json({ 
      success: true,
      inspection: {
        ...inspection.toObject(),
        farmName: inspection.farmId?.farmName || 'N/A',
        inspectorName: inspection.inspectorId?.name || 'Unknown',
        status: inspection.status || 'scheduled'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching inspection' });
  }
});

// Create new inspection (inspectors only)
router.post('/', auth, isInspector, [
  body('farmId').isMongoId().withMessage('Invalid farm ID'),
  body('inspectionDate').isISO8601().withMessage('Invalid date format'),
  body('inspectionType').isIn(['routine', 'emergency', 'follow_up', 'certification']).withMessage('Invalid inspection type'),
  body('overallScore').isNumeric().withMessage('Overall score must be numeric')
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

    // Verify farm exists
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    console.log('Creating new inspection with data:', {
      farmId,
      inspectionDate,
      inspectionType,
      overallScore,
      complianceStatus,
      inspectorId: req.user.userId
    });

    const inspection = new Inspection({
      farmId,
      inspectorId: req.user.userId,
      inspectionDate,
      inspectionType,
      biosecurityChecks: biosecurityChecks || {
        perimeterSecurity: { score: 0, notes: '', compliant: false },
        accessControl: { score: 0, notes: '', compliant: false },
        quarantineFacility: { score: 0, notes: '', compliant: false },
        wasteManagement: { score: 0, notes: '', compliant: false },
        disinfection: { score: 0, notes: '', compliant: false },
        pestControl: { score: 0, notes: '', compliant: false }
      },
      livestockHealth: livestockHealth || {
        overallHealth: 'good',
        vaccinationStatus: 'up_to_date',
        diseaseSigns: [],
        mortalityRate: 0,
        feedQuality: 'good'
      },
      recommendations: recommendations || [],
      overallScore: overallScore || 0,
      complianceStatus: complianceStatus || 'compliant',
      nextInspectionDate: nextInspectionDate || null,
      images: images || [],
      notes: notes || ''
    });

    console.log('Saving inspection...');
    const savedInspection = await inspection.save();
    console.log('Inspection saved successfully:', savedInspection._id);

    // Populate the response with detailed information
    const populatedInspection = await Inspection.findById(savedInspection._id)
      .populate({
        path: 'farmId',
        select: 'farmName farmType location'
      })
      .populate({
        path: 'inspectorId',
        select: 'name email'
      });

    console.log('Sending response for inspection:', populatedInspection._id);
    res.status(201).json({ 
      success: true,
      message: 'Inspection created successfully',
      inspection: {
        ...populatedInspection.toObject(),
        farmName: populatedInspection.farmId?.farmName || 'N/A',
        inspectorName: populatedInspection.inspectorId?.name || 'Unknown',
        status: populatedInspection.status || 'scheduled'
      }
    });
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating inspection',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    const updatedInspection = await Inspection.findOneAndUpdate(
      { _id: req.params.id, inspectorId: req.user.userId },
      {
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    .populate({
      path: 'farmId',
      select: 'farmName farmType location'
    })
    .populate({
      path: 'inspectorId',
      select: 'name email'
    });

    if (!updatedInspection) {
      return res.status(404).json({ 
        success: false,
        message: 'Inspection not found or access denied' 
      });
    }

    res.json({ 
      success: true,
      message: 'Inspection updated successfully',
      inspection: {
        ...updatedInspection.toObject(),
        farmName: updatedInspection.farmId?.farmName || 'N/A',
        inspectorName: updatedInspection.inspectorId?.name || 'Unknown',
        status: updatedInspection.status || 'scheduled'
      }
    });
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

module.exports = router;
