const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Update user role (admin only)
router.patch(
  '/users/:userId/role',
  [
    auth,
    isAdmin,
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('role').isIn(['farmer', 'inspector', 'admin']).withMessage('Invalid role')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.params;
      const { role } = req.body;

      // Prevent modifying the last admin
      if (role !== 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({ 
            message: 'Cannot remove the last admin. Please assign another admin first.' 
          });
        }
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ 
        message: 'User role updated successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Server error while updating user role' });
    }
  }
);

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role farmType farmSize createdAt');
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;
