import express from 'express';
import { AuthRequest } from '../types';
import { bookingService } from '../services/BookingService';
import { Response } from 'express';

const router = express.Router();

// Get all bookings
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userBookings = await bookingService.getUserBookings(req.user!);
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get single booking
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user!);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Create booking
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.createBooking({
      ...req.body,
      userId: req.user!.id
    });
    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating booking' });
    }
  }
});

// Update booking
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body, req.user!);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

// Cancel booking
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user!);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

export default router;