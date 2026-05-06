const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ServicePackage = require('../models/ServicePackage');

dotenv.config();

const Product = require('../models/Product');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ServicePackage.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '9998887776',
      address: 'Coimbatore',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    // Create customer user
    const customer = new User({
      name: 'Divakar G',
      email: 'divakar@example.com',
      password: 'password123',
      phone: '9876543210',
      address: 'Coimbatore, Tamil Nadu',
      role: 'customer'
    });
    await customer.save();
    console.log('Customer user created');

    // Create service packages
    const services = [
      {
        name: 'Basic Service',
        price: 899,
        description: 'Oil change, water wash, general check-up',
        duration: '2-3 hours',
        category: 'basic',
        features: ['Engine Oil Change', 'Water Wash', 'General Inspection', 'Tire Pressure Check']
      },
      {
        name: 'Full Service',
        price: 1499,
        description: 'Full inspection, oil change, filter cleaning, wash',
        duration: '4-5 hours',
        category: 'full',
        features: ['Complete Engine Service', 'Oil & Filter Change', 'Brake Inspection', 'AC Service', 'Full Body Wash']
      },
      {
        name: 'Repair Service',
        price: 'Based on issue',
        description: 'Mechanical and electrical repairs',
        duration: 'Varies',
        category: 'repair',
        features: ['Diagnostic Check', 'Mechanical Repairs', 'Electrical Repairs', 'Parts Replacement']
      },
      {
        name: 'Maintenance Package',
        price: 2499,
        description: 'Complete maintenance with parts replacement',
        duration: '6-8 hours',
        category: 'maintenance',
        features: ['Full Service', 'Parts Replacement', 'Wheel Alignment', 'Battery Check', 'Suspension Check']
      }
    ];

    await ServicePackage.insertMany(services);
    console.log('Service packages created');

    // Create products
    const products = [
      { name: 'Engine Oil', price: 799, category: 'Maintenance', emoji: '🛢️', description: 'High-quality synthetic engine oil', image: 'https://s3-ap-southeast-2.amazonaws.com/mytyresite-images/news/P0rqvBNxgn_engine_oil_change.webp' },
      { name: 'Air Filter', price: 299, category: 'Parts', emoji: '🌬️', description: 'Premium air filter', image: 'https://tgpindia.com/wp-content/uploads/2024/08/Tata-truck-air-filter.png' },
      { name: 'Brake Pads', price: 1499, category: 'Safety', emoji: '🛑', description: 'Reliable brake pads', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBHynRHalLhwGJxvyKICpfBTnARpoLt51YYw&s' },
      { name: 'Car Battery', price: 5499, category: 'Electrical', emoji: '🔋', description: 'Long-lasting battery', image: 'https://images.tayna.com/prod-images/1200/Powerline/065-powerline-45-435.jpg' },
      { name: 'Spark Plugs', price: 899, category: 'Engine', emoji: '⚡', description: 'High-performance spark plugs', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSVsRJc21ZqNmjNhh0zc2ght1FHGVJxT25Qg&s' },
      { name: 'Tire Pressure Gauge', price: 399, category: 'Tools', emoji: '📏', description: 'Accurate tire pressure tool', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9AsjbGF2G_tNdF1itm7ig_kg3knRu-RO1iQ&s' },
      { name: 'Wiper Blades', price: 699, category: 'Safety', emoji: '🧽', description: 'Clear visibility wiper blades', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTyf9bVxDuEYd06RhFz3ELL3TnjfOai6yTw&s' },
      { name: 'Car Floor Mats', price: 1199, category: 'Interior', emoji: '🚗', description: 'Durable floor mats', image: 'https://m.media-amazon.com/images/I/81qQjUKZr9L._AC_UF1000,1000_QL80_.jpg' }
    ];

    await Product.insertMany(products);
    console.log('Products created');

    console.log('\n=== Seed Data Summary ===');
    console.log('Admin Email: admin@example.com');
    console.log('Admin Password: admin123');
    console.log('Customer Email: divakar@example.com');
    console.log('Customer Password: password123');
    console.log('Service Packages: 4 packages created');
    console.log('Products: 8 products created');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();