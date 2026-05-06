const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const ServicePackage = require('../models/ServicePackage');

const router = express.Router();

// Get all bookings for a user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('vehicleId', 'brand model numberPlate')
      .populate('servicePackageId', 'name price description')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    })
      .populate('vehicleId', 'brand model numberPlate year')
      .populate('servicePackageId', 'name price description duration')
      .populate('userId', 'name email phone address');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new booking
router.post('/', [
  auth,
  body('brand').optional().notEmpty().withMessage('Vehicle brand is required'),
  body('model').optional().notEmpty().withMessage('Vehicle model is required'),
  body('numberPlate').optional().notEmpty().withMessage('Number plate is required'),
  body('servicePackageId').notEmpty().withMessage('Service package ID is required'),
  body('serviceDate').isISO8601().withMessage('Valid service date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required')
], async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { brand, model, numberPlate, servicePackageId, serviceDate, timeSlot, pickupRequired, pickupAddress } = req.body;

    // Create or find vehicle
    let vehicle;
    if (brand && model && numberPlate) {
      vehicle = await Vehicle.findOne({ 
        numberPlate: numberPlate.toUpperCase(),
        userId: req.user.userId
      });

      if (!vehicle) {
        vehicle = new Vehicle({
          userId: req.user.userId,
          brand,
          model,
          numberPlate: numberPlate.toUpperCase(),
          year: new Date().getFullYear(),
          vehicleType: 'car'
        });
        await vehicle.save();
        console.log('Vehicle created:', vehicle._id);
      }
    }

    // Get service price
    const servicePrices = {
      'basic': 899,
      'full': 1499,
      'repair': 2499,
      'maintenance': 3999
    };
    const totalAmount = servicePrices[servicePackageId] || 999;

    // Create booking in MongoDB
    const booking = new Booking({
      userId: req.user.userId,
      vehicleId: vehicle ? vehicle._id : null,
      servicePackageId,
      serviceDate,
      timeSlot,
      pickupRequired: pickupRequired || false,
      pickupAddress: pickupRequired ? pickupAddress : '',
      totalAmount,
      status: 'confirmed'
    });

    await booking.save();
    console.log('Booking saved to MongoDB:', booking._id);

    res.status(201).json({ 
      message: 'Vehicle booked successfully', 
      booking: {
        _id: booking._id,
        userId: booking.userId,
        servicePackageId: booking.servicePackageId,
        serviceDate: booking.serviceDate,
        timeSlot: booking.timeSlot,
        totalAmount: booking.totalAmount,
        status: booking.status,
        pickupRequired: booking.pickupRequired,
        pickupAddress: booking.pickupAddress,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', [
  auth,
  body('status').isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.userId.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    booking.status = req.body.status;
    await booking.save();
    await booking.populate('vehicleId servicePackageId userId');

    res.json({ 
      message: 'Booking status updated successfully', 
      booking 
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update payment status
router.put('/:id/payment', [
  auth,
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.paymentStatus = req.body.paymentStatus;
    await booking.save();
    await booking.populate('vehicleId servicePackageId userId');

    res.json({ 
      message: 'Payment status updated successfully', 
      booking 
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all bookings (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const bookings = await Booking.find()
      .populate('vehicleId', 'brand model numberPlate')
      .populate('servicePackageId', 'name price')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get booking statistics (Admin only)
router.get('/admin/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;