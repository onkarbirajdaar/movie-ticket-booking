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

module.exports = { createBooking };