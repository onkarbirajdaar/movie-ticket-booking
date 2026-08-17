const prisma = require('../config/prisma');

const createBooking = async (req, res) => {
  try {
    const { showSeatIds } = req.body; // array of ShowSeat ids the customer is booking
    const userId = req.user.userId;

    if (!showSeatIds || showSeatIds.length === 0) {
      return res.status(400).json({ error: 'showSeatIds is required' });
    }

    // Everything below runs as one atomic unit
    const booking = await prisma.$transaction(async (tx) => {
      // Step 1: fetch the seats being booked, and verify every one is still HELD
      const showSeats = await tx.showSeat.findMany({
        where: { id: { in: showSeatIds } },
      });

      if (showSeats.length !== showSeatIds.length) {
        throw new Error('One or more seats not found');
      }

      const notHeld = showSeats.find((s) => s.status !== 'HELD');
      if (notHeld) {
        throw new Error('One or more seats are not currently held');
      }

      // Step 2: calculate pricing
      const subtotal = showSeats.reduce((sum, s) => sum + s.price, 0);
      const fees = Math.round(subtotal * 0.05); // 5% mock convenience fee
      const tax = Math.round(subtotal * 0.18);  // 18% mock tax
      const total = subtotal + fees + tax;

      // Step 3: create the booking record
      const bookingCode = 'BK' + Date.now().toString(36).toUpperCase();

      const newBooking = await tx.booking.create({
        data: {
          bookingCode,
          userId,
          showId: showSeats[0].showId,
          status: 'PENDING',
          subtotal, fees, tax, total,
          paymentStatus: 'PENDING',
        },
      });

      // Step 4: create one BookingItem per seat, preserving price at time of purchase
      await tx.bookingItem.createMany({
        data: showSeats.map((s) => ({
          bookingId: newBooking.id,
          showSeatId: s.id,
          price: s.price,
        })),
      });

      return newBooking;
    });

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Failed to create booking' });
  }
};

const mockPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { outcome } = req.body; // 'APPROVED', 'DECLINED', or 'PENDING' — simulated by the client

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bookingItems: { include: { showseat: true } } },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: 'Booking already processed' });
    }

    if (outcome === 'APPROVED') {
      const result = await prisma.$transaction(async (tx) => {
        // Mark every seat in this booking as BOOKED (was HELD)
        const showSeatIds = booking.bookingItems.map((item) => item.showSeatId);
        await tx.showSeat.updateMany({
          where: { id: { in: showSeatIds } },
          data: { status: 'BOOKED', holdExpiresAt: null },
        });

        return tx.booking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED', paymentStatus: 'SUCCESS' },
        });
      });

      return res.json({ message: 'Payment approved', booking: result });
    }

    if (outcome === 'DECLINED') {
      // Release the seats back to AVAILABLE, mark booking failed
      const result = await prisma.$transaction(async (tx) => {
        const showSeatIds = booking.bookingItems.map((item) => item.showSeatId);
        await tx.showSeat.updateMany({
          where: { id: { in: showSeatIds } },
          data: { status: 'AVAILABLE', holdExpiresAt: null },
        });

        return tx.booking.update({
          where: { id: bookingId },
          data: { status: 'FAILED', paymentStatus: 'FAILED' },
        });
      });

      return res.json({ message: 'Payment declined', booking: result });
    }

    // PENDING outcome — leave everything as-is, just acknowledge
    res.json({ message: 'Payment pending', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.userId },
      include: {
        show: { include: { movie: true, screen: { include: { theatre: true } } } },
        bookingItems: { include: { showseat: { include: { seat: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};


const getBookingByCode = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: req.params.code },
      include: {
        show: { include: { movie: true, screen: { include: { theatre: true } } } },
        bookingItems: { include: { showseat: { include: { seat: true } } } },
      },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only the booking's owner (or an admin) can view it
    if (booking.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

module.exports = { createBooking, mockPayment, getMyBookings, getBookingByCode };




