const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmName: {
    type: String,
    required: true,
    trim: true
  },
  farmType: {
    type: String,
    enum: ['pig', 'poultry', 'dairy', 'livestock', 'crop', 'mixed', 'other'],
    required: true
  },
  location: {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  farmSize: {
    type: Number,
    required: false // Making it optional, will default to 0 in frontend if not provided
  },
  capacity: {
    pigs: { type: Number, default: 0 },
    poultry: { type: Number, default: 0 },
    cattle: { type: Number, default: 0 } // Added cattle capacity
  },
  establishedDate: {
    type: Date,
    required: false // Making it optional, will default in frontend if not provided
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  contactPerson: { type: String, trim: true, required: false }, // Added contact person
  contactNumber: { type: String, trim: true, required: false }, // Added contact number
  email: { type: String, trim: true, lowercase: true, required: false }, // Added email
  biosecurityLevel: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'basic'
  },
  facilities: [{
    type: String,
    enum: [
      'Veterinary Services', 'Feed Storage', 'Water Supply',
      'Biosecurity', 'Waste Management', 'Quarantine Area',
      'housing', 'feeding', 'watering', 'waste_management', 'quarantine', 'vaccination_room' // Expanded enum
    ]
  }],
  livestock: [{
    type: {
      type: String,
      enum: ['pig', 'chicken', 'duck', 'turkey', 'cattle'] // Expanded livestock types
    },
    breed: String,
    quantity: Number,
    age: Number, // in weeks/months
    healthStatus: {
      type: String,
      enum: ['healthy', 'sick', 'quarantined', 'vaccinated'],
      default: 'healthy'
    }
  }],
  description: { type: String, trim: true }, // Added description
  climateData: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    lastUpdated: Date
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

// Update the updatedAt field before saving
farmSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Farm', farmSchema);
