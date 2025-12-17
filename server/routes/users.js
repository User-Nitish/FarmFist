const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get user details by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // Users can only view their own profile or admins can view any
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// Update user (users can update themselves, admins can update anyone)
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('farmType').optional().isIn(['pig', 'poultry', 'both']).withMessage('Invalid farm type'),
  body('farmSize').optional().isIn(['small', 'medium', 'large']).withMessage('Invalid farm size')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check permissions
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = {};
    const allowedFields = ['name', 'phone', 'address', 'experience', 'farmType', 'farmSize', 'profileImage'];

    // Only admins can change roles
    if (req.user.role === 'admin') {
      allowedFields.push('role', 'isVerified');
    }

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const farmers = await User.countDocuments({ role: 'farmer' });
    const inspectors = await User.countDocuments({ role: 'inspector' });
    const admins = await User.countDocuments({ role: 'admin' });

    const farmTypeStats = await User.aggregate([
      { $group: { _id: '$farmType', count: { $sum: 1 } } }
    ]);

    const farmSizeStats = await User.aggregate([
      { $group: { _id: '$farmSize', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      roleBreakdown: { farmers, inspectors, admins },
      farmTypeBreakdown: farmTypeStats,
      farmSizeBreakdown: farmSizeStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching user statistics' });
  }
});

// Verify user email (admin only)
router.put('/:id/verify', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while verifying user' });
  }
});

module.exports = router;
