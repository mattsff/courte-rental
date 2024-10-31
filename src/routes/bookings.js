const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage
let bookings = [];

// Get all bookings
router.get('/', (req, res) => {
  // Filter bookings based on user role
  const userBookings = req.user.role === 'admin' 
    ? bookings 
    : bookings.filter(booking => booking.userId === req.user.id);
  res.json(userBookings);
});

// Get single booking
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  
  // Check if user has permission to view this booking
  if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  res.json(booking);
});

// Create booking
router.post('/', (req, res) => {
  const { courtId, startTime, endTime } = req.body;
  
  if (!courtId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check for booking conflicts
  const hasConflict = bookings.some(booking => 
    booking.courtId === courtId &&
    new Date(startTime) < new Date(booking.endTime) &&
    new Date(endTime) > new Date(booking.startTime)
  );

  if (hasConflict) {
    return res.status(409).json({ message: 'Court is already booked for this time' });
  }

  const booking = {
    id: uuidv4(),
    courtId,
    userId: req.user.id,
    startTime,
    endTime,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  res.status(201).json(booking);
});

// Update booking
router.put('/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Booking not found' });

  // Check if user has permission to update this booking
  if (req.user.role !== 'admin' && bookings[index].userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const updatedBooking = {
    ...bookings[index],
    ...req.body,
    id: bookings[index].id,
    userId: bookings[index].userId // Prevent userId modification
  };

  bookings[index] = updatedBooking;
  res.json(updatedBooking);
});

// Cancel booking
router.delete('/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Booking not found' });

  // Check if user has permission to cancel this booking
  if (req.user.role !== 'admin' && bookings[index].userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  bookings[index].status = 'cancelled';
  res.json(bookings[index]);
});

module.exports = router;