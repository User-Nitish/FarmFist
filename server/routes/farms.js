const express = require('express');
const { body, validationResult } = require('express-validator');
const Farm = require('../models/Farm');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all farms for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ farms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching farms' });
  }
});

// Get single farm by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({ farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching farm' });
  }
});

// Create new farm
router.post('/', auth, [
  body('farmName').trim().isLength({ min: 2 }).withMessage('Farm name must be at least 2 characters'),
  body('farmType').isIn(['pig', 'poultry', 'both']).withMessage('Invalid farm type'),
  body('farmSize').isIn(['small', 'medium', 'large']).withMessage('Invalid farm size'),
  body('establishedDate').isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      farmName,
      farmType,
      location,
      farmSize,
      capacity,
      establishedDate,
      biosecurityLevel,
      facilities,
      livestock
    } = req.body;

    const farm = new Farm({
      userId: req.user.userId,
      farmName,
      farmType,
      location,
      farmSize,
      capacity,
      establishedDate,
      biosecurityLevel: biosecurityLevel || 'basic',
      facilities: facilities || [],
      livestock: livestock || []
    });

    await farm.save();
    res.status(201).json({ message: 'Farm created successfully', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating farm' });
  }
});

// Update farm
router.put('/:id', auth, [
  body('farmName').optional().trim().isLength({ min: 2 }),
  body('farmType').optional().isIn(['pig', 'poultry', 'both']),
  body('farmSize').optional().isIn(['small', 'medium', 'large']),
  body('biosecurityLevel').optional().isIn(['basic', 'intermediate', 'advanced'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    const allowedUpdates = [
      'farmName', 'farmType', 'farmSize', 'location', 'capacity', 
      'biosecurityLevel', 'facilities', 'description', 'biosecurity'
    ];
    
    // Add only the fields that are being updated
    Object.keys(req.body).forEach(update => {
      if (allowedUpdates.includes(update)) {
        updates[update] = req.body[update];
      }
    });

    // Handle location updates
    if (req.body.location) {
      updates['location'] = { ...req.body.location };
    }

    // Handle capacity updates
    if (req.body.capacity) {
      updates['capacity'] = { ...req.body.capacity };
    }

    // Handle biosecurity updates
    if (req.body.biosecurity) {
      // If updating biosecurity, we need to merge the existing data with the new data
      const farm = await Farm.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!farm) {
        return res.status(404).json({ message: 'Farm not found or not authorized' });
      }
      
      // Merge the existing biosecurity data with the new data
      updates.biosecurity = {
        ...farm.biosecurity,
        ...req.body.biosecurity,
        // For nested objects, we need to merge them individually
        ...(req.body.biosecurity.perimeterControl && {
          perimeterControl: {
            ...(farm.biosecurity?.perimeterControl || {}),
            ...req.body.biosecurity.perimeterControl
          }
        }),
        ...(req.body.biosecurity.personnel && {
          personnel: {
            ...(farm.biosecurity?.personnel || {}),
            ...req.body.biosecurity.personnel
          }
        }),
        ...(req.body.biosecurity.vehicleHygiene && {
          vehicleHygiene: {
            ...(farm.biosecurity?.vehicleHygiene || {}),
            ...req.body.biosecurity.vehicleHygiene
          }
        }),
        ...(req.body.biosecurity.animalManagement && {
          animalManagement: {
            ...(farm.biosecurity?.animalManagement || {}),
            ...req.body.biosecurity.animalManagement
          }
        }),
        ...(req.body.biosecurity.cleaningSanitation && {
          cleaningSanitation: {
            ...(farm.biosecurity?.cleaningSanitation || {}),
            ...req.body.biosecurity.cleaningSanitation
          }
        }),
        ...(req.body.biosecurity.pigSpecific && {
          pigSpecific: {
            ...(farm.biosecurity?.pigSpecific || {}),
            ...req.body.biosecurity.pigSpecific
          }
        }),
        ...(req.body.biosecurity.pigHealth && {
          pigHealth: {
            ...(farm.biosecurity?.pigHealth || {}),
            ...req.body.biosecurity.pigHealth
          }
        })
      };
    }

    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found or not authorized' });
    }

    res.json({ farm });
  } catch (error) {
    console.error('Error updating farm:', error);
    res.status(500).json({ message: 'Error updating farm', error: error.message });
  }
});

// Delete farm
router.delete('/:id', auth, async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting farm' });
  }
});

// Update livestock data for a farm
router.put('/:id/livestock', auth, async (req, res) => {
  try {
    const { livestock } = req.body;

    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { livestock, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({ message: 'Livestock data updated successfully', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating livestock data' });
  }
});

// Update climate data for a farm
router.put('/:id/climate', auth, async (req, res) => {
  try {
    const { temperature, humidity, rainfall, windSpeed } = req.body;

    const climateData = {
      temperature,
      humidity,
      rainfall,
      windSpeed,
      lastUpdated: new Date()
    };

    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { climateData },
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({ message: 'Climate data updated successfully', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating climate data' });
  }
});

module.exports = router;
