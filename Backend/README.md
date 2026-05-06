# Vehicle Service Management Backend API

A comprehensive Express.js backend API for managing vehicle services, bookings, and customer interactions.

## Features

- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Customer/Admin)

- **Vehicle Management**
  - Add, update, delete vehicles
  - Vehicle ownership validation

- **Service Management**
  - Service package CRUD operations
  - Admin-only service management

- **Booking System**
  - Create and manage service bookings
  - Booking status tracking
  - Payment processing

- **Contact Management**
  - Contact form submissions
  - Admin message management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Vehicles
- `GET /api/vehicles` - Get user vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Services
- `GET /api/services` - Get all service packages
- `POST /api/services` - Create service package (Admin)
- `PUT /api/services/:id` - Update service package (Admin)
- `DELETE /api/services/:id` - Delete service package (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/payment` - Process payment
- `GET /api/bookings/admin/all` - Get all bookings (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (Admin)
- `PUT /api/contact/:id/status` - Update message status (Admin)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Usage

The server will start on `http://localhost:5000`

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Default Users
- Customer: `divakar@example.com` / `password123`
- Admin: `admin@example.com` / `admin123`

## Data Storage

Currently uses in-memory JSON storage. For production, integrate with a database like MongoDB or PostgreSQL.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- Role-based access control
- CORS enabled for frontend integration