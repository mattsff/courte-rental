# Court Rental API

A TypeScript-based REST API for managing court rentals, bookings, and user authentication.

## Features

- 🏸 Court Management
- 📅 Booking System
- 👥 User Authentication
- 🔐 Role-based Access Control
- 📸 Image Upload Support
- 🛠 Maintenance Scheduling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- TypeScript
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd court-rental-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

4. Start MongoDB:
```bash
# Using MongoDB Community Edition
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile

### Courts
- `GET /api/cms/courts` - Get all courts
- `GET /api/cms/courts/:id` - Get court by ID
- `POST /api/cms/courts` - Create court (Admin only)
- `PUT /api/cms/courts/:id` - Update court (Admin only)
- `DELETE /api/cms/courts/:id` - Delete court (Admin only)
- `POST /api/cms/courts/:id/images` - Upload court image (Admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## Testing

Run the test suite:
```bash
npm run test
```

## File Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript interfaces
└── index.ts        # App entry point
```

## Development

1. Run in development mode:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## API Authentication

Use JWT tokens in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Example Requests

### Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Create Court (Admin)
```bash
curl -X POST http://localhost:3000/api/cms/courts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Center Court",
    "type": "Tennis",
    "pricePerHour": 50,
    "isAvailable": true
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "courtId": "court-id",
    "startTime": "2023-11-01T10:00:00Z",
    "endTime": "2023-11-01T11:00:00Z"
  }'
```

## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request