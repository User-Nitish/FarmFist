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
    enum: ['pig', 'poultry', 'both'],
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  farmSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true
  },
  capacity: {
    pigs: Number,
    poultry: Number
  },
  establishedDate: {
    type: Date,
    required: true
  },
  biosecurityLevel: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'basic'
  },
  biosecurity: {
    // Perimeter Security
    perimeterControl: {
      fencing: { type: Boolean, default: false },
      fencingType: { type: String, enum: ['none', 'electric', 'chainlink', 'wooden', 'wire', 'other'], default: 'none' },
      signage: { type: Boolean, default: false },
      controlledAccess: { type: Boolean, default: false },
      securityCameras: { type: Boolean, default: false },
      lighting: { type: Boolean, default: false },
      notes: { type: String, default: '' }
    },
    
    // Personnel & Visitors
    personnel: {
      dedicatedClothing: { type: Boolean, default: false },
      clothingProvided: { type: Boolean, default: false },
      handwashingStations: { type: Boolean, default: false },
      handSanitizerAvailable: { type: Boolean, default: false },
      footbaths: { type: Boolean, default: false },
      footbathSolution: { type: String, enum: ['none', 'quat', 'iodine', 'chlorine', 'other'], default: 'none' },
      visitorLogs: { type: Boolean, default: false },
      visitorScreening: { type: Boolean, default: false },
      trainingProvided: { type: Boolean, default: false },
      trainingFrequency: { type: String, enum: ['none', 'monthly', 'quarterly', 'biannually', 'annually', 'asNeeded'], default: 'none' },
      notes: { type: String, default: '' }
    },
    
    // Vehicle & Equipment
    vehicleHygiene: {
      disinfection: { type: Boolean, default: false },
      disinfectionFrequency: { type: String, enum: ['none', 'daily', 'weekly', 'biweekly', 'monthly', 'asNeeded'], default: 'none' },
      wheelWash: { type: Boolean, default: false },
      designatedParking: { type: Boolean, default: false },
      equipmentCleaning: { type: Boolean, default: false },
      equipmentStorage: { type: String, enum: ['shared', 'dedicated', 'none'], default: 'shared' },
      notes: { type: String, default: '' }
    },
    
    // Animal Management
    animalManagement: {
      quarantineArea: { type: Boolean, default: false },
      quarantineDuration: { type: Number, default: 0 },
      allInAllOut: { type: Boolean, default: false },
      ageGroupSeparation: { type: Boolean, default: false },
      pestControl: { type: Boolean, default: false },
      pestControlMethod: { type: String, enum: ['none', 'chemical', 'traps', 'biological', 'other'], default: 'none' },
      wildlifeDeterrents: { type: Boolean, default: false },
      deadstockRemoval: { type: String, enum: ['none', 'daily', 'weekly', 'asNeeded'], default: 'none' },
      notes: { type: String, default: '' }
    },
    
    // Cleaning & Sanitation
    cleaningSanitation: {
      regularDisinfection: { type: Boolean, default: false },
      disinfectionFrequency: { type: String, enum: ['none', 'daily', 'weekly', 'biweekly', 'monthly'], default: 'none' },
      wasteManagement: { type: Boolean, default: false },
      wasteDisposalMethod: { type: String, enum: ['none', 'composting', 'landfill', 'incineration', 'other'], default: 'none' },
      mortalityDisposal: { type: Boolean, default: false },
      mortalityMethod: { type: String, enum: ['none', 'burial', 'incineration', 'rendering', 'composting', 'other'], default: 'none' },
      equipmentCleaning: { type: Boolean, default: false },
      waterSanitization: { type: Boolean, default: false },
      notes: { type: String, default: '' }
    },
    
    // Poultry Specific
    poultrySpecific: {
      eggCollection: { type: Boolean, default: false },
      eggStorage: { type: Boolean, default: false },
      nestBoxManagement: { type: Boolean, default: false },
      litterManagement: { type: Boolean, default: false },
      waterSystem: { type: String, enum: ['open', 'nipple', 'bell', 'cup', 'other'], default: 'open' },
      feedStorage: { type: Boolean, default: false },
      rodentControl: { type: Boolean, default: false },
      wildBirdControl: { type: Boolean, default: false },
      notes: { type: String, default: '' }
    },
    
    // Poultry Health
    poultryHealth: {
      vaccinationProgram: { type: Boolean, default: false },
      vaccinationRecords: { type: Boolean, default: false },
      dewormingSchedule: { type: Boolean, default: false },
      diseaseSurveillance: { type: Boolean, default: false },
      veterinaryVisits: { type: Boolean, default: false },
      mortalityRate: { type: Number, default: 0 },
      biosecurityAudit: { type: Boolean, default: false },
      auditFrequency: { type: String, enum: ['none', 'monthly', 'quarterly', 'biannually', 'annually'], default: 'none' },
      notes: { type: String, default: '' }
    },
    
    // Pig Specific
    pigSpecific: {
      farrowingArea: { type: Boolean, default: false },
      farrowingHygiene: { type: String, enum: ['basic', 'intermediate', 'advanced'], default: 'basic' },
      sickBay: { type: Boolean, default: false },
      isolationArea: { type: Boolean, default: false },
      rodentControl: { type: Boolean, default: false },
      feedStorage: { type: Boolean, default: false },
      feedQualityControl: { type: Boolean, default: false },
      waterQuality: { type: Boolean, default: false },
      manureManagement: { type: String, enum: ['none', 'lagoon', 'composting', 'directApplication', 'other'], default: 'none' },
      notes: { type: String, default: '' }
    },
    
    // Pig Health
    pigHealth: {
      vaccinationProgram: { type: Boolean, default: false },
      vaccinationRecords: { type: Boolean, default: false },
      dewormingSchedule: { type: Boolean, default: false },
      diseaseSurveillance: { type: Boolean, default: false },
      veterinaryVisits: { type: Boolean, default: false },
      mortalityRate: { type: Number, default: 0 },
      biosecurityAudit: { type: Boolean, default: false },
      auditFrequency: { type: String, enum: ['none', 'monthly', 'quarterly', 'biannually', 'annually'], default: 'none' },
      notes: { type: String, default: '' }
    }
  },
  facilities: [{
    type: String,
    enum: ['housing', 'feeding', 'watering', 'waste_management', 'quarantine', 'vaccination_room']
  }],
  livestock: [{
    type: {
      type: String,
      enum: ['pig', 'chicken', 'duck', 'turkey']
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
farmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farm', farmSchema);
