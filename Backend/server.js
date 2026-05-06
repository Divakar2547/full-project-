const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch(() => {
  console.log('MongoDB connection failed');
});

// CORS — allow localhost dev + deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);

// Vehicle data compatibility endpoint
app.get('/Vechile.json', (req, res) => {
  res.json({ users: [], vehicles: [], servicePackages: [], bookings: [], payments: [], adminLogs: [] });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vehicle Service API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: Object.values(err.errors).map(e => e.message) });
  }
  if (err.code === 11000) {
    return res.status(400).json({ error: `${Object.keys(err.keyValue)[0]} already exists` });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});