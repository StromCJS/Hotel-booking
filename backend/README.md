# Hotel Booking Backend API

A comprehensive REST API for a hotel booking system built with Node.js, Express, TypeScript, and SQLite.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Room Management** - CRUD operations for hotel rooms with filtering and availability checking
- **Booking System** - Complete booking lifecycle with payment processing
- **Payment Integration** - Stripe payment processing with webhooks
- **Database** - SQLite with Sequelize ORM
- **Security** - Helmet, CORS, rate limiting, input validation
- **Logging** - Morgan request logging
- **TypeScript** - Full type safety

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Payment**: Stripe
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Morgan

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DATABASE_PATH=./database.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 3. Database Setup

Initialize the database and seed with sample data:

```bash
# Build the project
npm run build

# Seed the database
npm run seed
```

### 4. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

#### PUT `/api/auth/profile`
Update user profile (requires authentication).

#### PUT `/api/auth/change-password`
Change user password (requires authentication).

### Room Endpoints

#### GET `/api/rooms`
Get all rooms with optional filtering and pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `type` - Room type filter (Deluxe, Suite, Executive, Presidential)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `status` - Room status filter (Available, Occupied, Cleaning)
- `capacity` - Minimum capacity filter
- `checkIn` - Check-in date for availability (ISO 8601)
- `checkOut` - Check-out date for availability (ISO 8601)

#### GET `/api/rooms/:id`
Get room by ID.

#### POST `/api/rooms` (Admin only)
Create a new room.

#### PUT `/api/rooms/:id` (Admin only)
Update room information.

#### DELETE `/api/rooms/:id` (Admin only)
Delete a room.

### Booking Endpoints

#### GET `/api/bookings`
Get user's bookings (or all bookings for admin).

#### GET `/api/bookings/:id`
Get booking by ID.

#### POST `/api/bookings/create-payment-intent`
Create Stripe payment intent for booking.

#### POST `/api/bookings/confirm`
Confirm booking after successful payment.

#### PUT `/api/bookings/:id/cancel`
Cancel a booking.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 💳 Payment Processing

The API integrates with Stripe for secure payment processing:

1. **Create Payment Intent**: Call `/api/bookings/create-payment-intent` to get client secret
2. **Process Payment**: Use Stripe Elements on frontend to collect payment
3. **Confirm Booking**: Call `/api/bookings/confirm` after successful payment

## 🗄️ Database Schema

### Users Table
- `id` - UUID primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (customer/admin)
- `phone` - Optional phone number
- `isActive` - Account status

### Rooms Table
- `id` - UUID primary key
- `roomNumber` - Unique room number
- `type` - Room type (Deluxe/Suite/Executive/Presidential)
- `price` - Room price per night
- `status` - Room status (Available/Occupied/Cleaning)
- `images` - Array of image URLs
- `amenities` - Array of amenities
- `description` - Room description
- `capacity` - Maximum guests
- `size` - Room size

### Bookings Table
- `id` - UUID primary key
- `userId` - Foreign key to users
- `roomId` - Foreign key to rooms
- `checkInDate` - Check-in date
- `checkOutDate` - Check-out date
- `totalPrice` - Total booking price
- `paymentStatus` - Payment status (Pending/Confirmed/Cancelled/Refunded)
- `paymentIntentId` - Stripe payment intent ID
- Guest information (name, email, phone)
- `specialRequests` - Optional special requests

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📦 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing control
- **Rate Limiting**: API rate limiting
- **Input Validation**: Comprehensive input validation
- **SQL Injection Protection**: Parameterized queries
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure authentication tokens

## 📝 Default Admin Account

After seeding the database, you can log in with:

- **Email**: `admin@hotelbooking.com`
- **Password**: `admin123`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
