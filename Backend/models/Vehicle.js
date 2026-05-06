const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  numberPlate: {
    type: String,
    required: [true, 'Number plate is required'],
    uppercase: true,
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'truck', 'bus'],
    default: 'car'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
vehicleSchema.index({ userId: 1 });
vehicleSchema.index({ numberPlate: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);