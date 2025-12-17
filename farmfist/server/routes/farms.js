const express = require('express');
const { body, validationResult } = require('express-validator');
const Farm = require('../models/Farm');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function for farm type enum validation
const isValidFarmType = (value) => {
  const allowedFarmTypes = ['pig', 'poultry', 'dairy', 'livestock', 'crop', 'mixed', 'other'];
  return allowedFarmTypes.includes(value);
};

// Helper function for facility enum validation
const isValidFacility = (value) => {
  const allowedFacilities = [
    'Veterinary Services', 'Feed Storage', 'Water Supply',
    'Biosecurity', 'Waste Management', 'Quarantine Area',
    'housing', 'feeding', 'watering', 'waste_management', 'quarantine', 'vaccination_room'
  ];
  return allowedFacilities.includes(value);
};

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
  body('farmType').custom(isValidFarmType).withMessage('Invalid farm type'),
  body('location.address').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Address must be a string if provided'),
  body('location.city').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('City must be a string if provided'),
  body('location.state').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('State must be a string if provided'),
  body('location.pincode').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Pincode must be a string if provided'),
  body('farmSize').optional({ nullable: true, checkFalsy: true }).isNumeric().withMessage('Farm size must be a number if provided'), 
  body('establishedDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid established date format'),
  body('contactPerson').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Contact person must be a string if provided'),
  body('contactNumber').optional({ nullable: true, checkFalsy: true }).trim().isMobilePhone().withMessage('Invalid contact number'),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Invalid email address'),
  body('biosecurityLevel').optional({ nullable: true, checkFalsy: true }).isIn(['basic', 'intermediate', 'advanced']).withMessage('Invalid biosecurity level'),
  body('facilities').optional().isArray().withMessage('Facilities must be an array'),
  body('facilities.*').optional({ nullable: true, checkFalsy: true }).custom(isValidFacility).withMessage('Invalid facility type')
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
      status,
      contactPerson,
      contactNumber,
      email,
      biosecurityLevel,
      facilities,
      description,
      livestock
    } = req.body;

    const newFarm = new Farm({
      userId: req.user.userId,
      farmName,
      farmType,
      location: location || {},
      farmSize,
      capacity,
      establishedDate,
      status: status || 'active',
      contactPerson,
      contactNumber,
      email,
      biosecurityLevel: biosecurityLevel || 'basic',
      facilities: facilities || [],
      description: description || '',
      livestock: livestock || []
    });

    await newFarm.save();
    res.status(201).json({ message: 'Farm created successfully', farm: newFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating farm' });
  }
});

// Update farm
router.put('/:id', auth, [
  body('farmName').optional().trim().isLength({ min: 2 }).withMessage('Farm name must be at least 2 characters'),
  body('farmType').optional().custom(isValidFarmType).withMessage('Invalid farm type'),
  body('location.address').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Address must be a string if provided'),
  body('location.city').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('City must be a string if provided'),
  body('location.state').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('State must be a string if provided'),
  body('location.pincode').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Pincode must be a string if provided'),
  body('farmSize').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Farm size must be a string if provided'),
  body('establishedDate').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid established date format'),
  body('contactPerson').optional({ nullable: true, checkFalsy: true }).trim().isString().withMessage('Contact person must be a string if provided'),
  body('contactNumber').optional({ nullable: true, checkFalsy: true }).trim().isMobilePhone().withMessage('Invalid contact number'),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Invalid email address'),
  body('biosecurityLevel').optional({ nullable: true, checkFalsy: true }).isIn(['basic', 'intermediate', 'advanced']).withMessage('Invalid biosecurity level'),
  body('facilities').optional().isArray().withMessage('Facilities must be an array'),
  body('facilities.*').optional({ nullable: true, checkFalsy: true }).custom(isValidFacility).withMessage('Invalid facility type')
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
      status,
      contactPerson,
      contactNumber,
      email,
      biosecurityLevel,
      facilities,
      description,
      livestock
    } = req.body;

    const updates = {};
    if (farmName !== undefined) updates.farmName = farmName;
    if (farmType !== undefined) updates.farmType = farmType;
    if (farmSize !== undefined) updates.farmSize = farmSize;
    if (capacity !== undefined) updates.capacity = capacity;
    if (establishedDate !== undefined) updates.establishedDate = establishedDate;
    if (status !== undefined) updates.status = status;
    if (contactPerson !== undefined) updates.contactPerson = contactPerson;
    if (contactNumber !== undefined) updates.contactNumber = contactNumber;
    if (email !== undefined) updates.email = email;
    if (biosecurityLevel !== undefined) updates.biosecurityLevel = biosecurityLevel;
    if (facilities !== undefined) updates.facilities = facilities;
    if (description !== undefined) updates.description = description;
    if (livestock !== undefined) updates.livestock = livestock;

    // Handle nested location updates
    if (location !== undefined) {
      updates.location = {
        ...updates.location, // Preserve existing location data if any
        ...(location.address !== undefined && { address: location.address }),
        ...(location.city !== undefined && { city: location.city }),
        ...(location.state !== undefined && { state: location.state }),
        ...(location.pincode !== undefined && { pincode: location.pincode })
      };
    }

    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({ message: 'Farm updated successfully', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating farm' });
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
