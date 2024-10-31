import { Booking, User } from '../types';
import { Court } from '../models/Court';
import { v4 as uuidv4 } from 'uuid';

interface CreateBookingDTO {
  courtId: string;
  userId: string;
  startTime: string;
  endTime: string;
}

interface UpdateBookingDTO {
  startTime?: string;
  endTime?: string;
  status?: 'confirmed' | 'cancelled' | 'completed';
}

export class BookingService {
  private bookings: Booking[] = [];

  async getUserBookings(user: User): Promise<Booking[]> {
    return user.role === 'admin'
      ? this.bookings
      : this.bookings.filter(booking => booking.userId === user.id);
  }

  async getBookingById(id: string, user: User): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return null;

    if (user.role !== 'admin' && booking.userId !== user.id) {
      return null;
    }

    return booking;
  }

  async createBooking(data: CreateBookingDTO): Promise<Booking> {
    // Check if court exists
    const court = await Court.findById(data.courtId);
    if (!court) {
      throw new Error('Court not found');
    }

    // Check for booking conflicts
    const hasConflict = await this.checkBookingConflict(
      data.courtId,
      new Date(data.startTime),
      new Date(data.endTime)
    );

    if (hasConflict) {
      throw new Error('Court is already booked for this time');
    }

    const booking: Booking = {
      id: uuidv4(),
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      totalPrice: await this.calculatePrice(data.courtId, data.startTime, data.endTime)
    };

    this.bookings.push(booking);
    return booking;
  }

  async updateBooking(
    id: string,
    data: UpdateBookingDTO,
    user: User
  ): Promise<Booking | null> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;

    if (
      user.role !== 'admin' &&
      this.bookings[index].userId !== user.id
    ) {
      return null;
    }

    if (data.startTime && data.endTime) {
      const hasConflict = await this.checkBookingConflict(
        this.bookings[index].courtId,
        new Date(data.startTime),
        new Date(data.endTime),
        id
      );

      if (hasConflict) {
        throw new Error('Court is already booked for this time');
      }
    }

    const updatedBooking = {
      ...this.bookings[index],
      ...data,
      id: this.bookings[index].id,
      userId: this.bookings[index].userId
    };

    this.bookings[index] = updatedBooking;
    return updatedBooking;
  }

  async cancelBooking(id: string, user: User): Promise<Booking | null> {
    const booking = await this.getBookingById(id, user);
    if (!booking) return null;

    booking.status = 'cancelled';
    return booking;
  }

  private async checkBookingConflict(
    courtId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    return this.bookings.some(
      booking =>
        booking.courtId === courtId &&
        booking.id !== excludeBookingId &&
        booking.status === 'confirmed' &&
        startTime < new Date(booking.endTime) &&
        endTime > new Date(booking.startTime)
    );
  }

  private async calculatePrice(
    courtId: string,
    startTime: string,
    endTime: string
  ): Promise<number> {
    const court = await Court.findById(courtId);
    if (!court) throw new Error('Court not found');

    const hours =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
      (1000 * 60 * 60);
    
    return court.pricePerHour * hours;
  }
}

export const bookingService = new BookingService();