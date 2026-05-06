const mongoose = require('mongoose');

const servicePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  price: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Price is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  duration: {
    type: String,
    default: '2-3 hours'
  },
  category: {
    type: String,
    enum: ['basic', 'full', 'repair', 'maintenance'],
    default: 'basic'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ServicePackage', servicePackageSchema);