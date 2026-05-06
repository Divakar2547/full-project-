const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit contact form
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({ 
      message: 'Thank you for your message. We will get back to you soon!',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all contact messages (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contact message by ID (Admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update message status (Admin only)
router.put('/:id/status', [
  auth,
  body('status').isIn(['new', 'in-progress', 'resolved']).withMessage('Invalid status'),
  body('adminResponse').optional().notEmpty().withMessage('Admin response cannot be empty')
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, adminResponse } = req.body;
    
    const updateData = { status };
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.respondedAt = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ 
      message: 'Contact message updated successfully', 
      contact 
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact message (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contact statistics (Admin only)
router.get('/admin/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const totalMessages = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const inProgressMessages = await Contact.countDocuments({ status: 'in-progress' });
    const resolvedMessages = await Contact.countDocuments({ status: 'resolved' });

    res.json({
      totalMessages,
      newMessages,
      inProgressMessages,
      resolvedMessages
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;