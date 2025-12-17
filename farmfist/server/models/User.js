const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  farmType: {
    type: String,
    enum: ['pig', 'poultry', 'both'],
    required: true
  },
  farmSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true
  },
  experience: {
    type: Number,
    min: 0
  },
  profileImage: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['farmer', 'inspector', 'admin'],
    default: 'farmer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
