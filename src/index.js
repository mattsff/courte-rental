const express = require('express');
const cors = require('cors');
const courtRoutes = require('./routes/courts');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use('/api/courts', auth, courtRoutes);
app.use('/api/bookings', auth, bookingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});