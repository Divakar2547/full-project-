const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const ServicePackage = require('../models/ServicePackage');

const router = express.Router();

// Get all active service packages
router.get('/', async (req, res) => {
  try {
    const services = await ServicePackage.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get service package by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await ServicePackage.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!service) {
      return res.status(404).json({ error: 'Service package not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new service package (Admin only)
router.post('/', [
  auth,
  body('name').notEmpty().withMessage('Service name is required'),
  body('price').notEmpty().withMessage('Price is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').optional().isIn(['basic', 'full', 'repair', 'maintenance']).withMessage('Invalid category'),
  body('features').optional().isArray().withMessage('Features must be an array')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description, duration, category, features } = req.body;

    const service = new ServicePackage({
      name,
      price,
      description,
      duration: duration || '2-3 hours',
      category: category || 'basic',
      features: features || []
    });

    await service.save();

    res.status(201).json({ 
      message: 'Service package created successfully', 
      service 
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update service package (Admin only)
router.put('/:id', [
  auth,
  body('name').optional().notEmpty().withMessage('Service name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isIn(['basic', 'full', 'repair', 'maintenance']).withMessage('Invalid category'),
  body('features').optional().isArray().withMessage('Features must be an array')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = await ServicePackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service package not found' });
    }

    res.json({ 
      message: 'Service package updated successfully', 
      service 
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete service package (Admin only) - Soft delete
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const service = await ServicePackage.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service package not found' });
    }

    res.json({ message: 'Service package deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;