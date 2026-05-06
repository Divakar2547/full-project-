const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Get all vehicles for a user
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ 
      userId: req.user.userId, 
      isActive: true 
    }).populate('userId', 'name email');
    
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get vehicle by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      isActive: true
    }).populate('userId', 'name email');

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new vehicle
router.post('/', [
  auth,
  body('brand').notEmpty().withMessage('Brand is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('numberPlate').notEmpty().withMessage('Number plate is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('vehicleType').optional().isIn(['car', 'bike', 'truck', 'bus']).withMessage('Invalid vehicle type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { brand, model, numberPlate, year, vehicleType } = req.body;

    // Check if number plate already exists
    const existingVehicle = await Vehicle.findOne({ numberPlate: numberPlate.toUpperCase() });
    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle with this number plate already exists' });
    }

    const vehicle = new Vehicle({
      userId: req.user.userId,
      brand,
      model,
      numberPlate: numberPlate.toUpperCase(),
      year,
      vehicleType: vehicleType || 'car'
    });

    await vehicle.save();
    await vehicle.populate('userId', 'name email');

    res.status(201).json({ 
      message: 'Vehicle added successfully', 
      vehicle 
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update vehicle
router.put('/:id', [
  auth,
  body('brand').optional().notEmpty().withMessage('Brand cannot be empty'),
  body('model').optional().notEmpty().withMessage('Model cannot be empty'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('vehicleType').optional().isIn(['car', 'bike', 'truck', 'bus']).withMessage('Invalid vehicle type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ 
      message: 'Vehicle updated successfully', 
      vehicle 
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete vehicle (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isActive: false },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;