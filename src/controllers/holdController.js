const prisma = require('../config/prisma');

const HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes, per the brief's recommendation

const createHold = async (req, res) => {
  try {
    const { showSeatId } = req.body;
    const userId = req.user.userId; // set by requireAuth middleware

    if (!showSeatId) {
      return res.status(400).json({ error: 'showSeatId is required' });
    }

    const holdExpiresAt = new Date(Date.now() + HOLD_DURATION_MS);

    // The atomic conditional update — only succeeds if seat is currently AVAILABLE
    const result = await prisma.showSeat.updateMany({
      where: {
        id: showSeatId,
        status: 'AVAILABLE',
      },
      data: {
        status: 'HELD',
        holdExpiresAt,
      },
    });

    if (result.count === 0) {
      return res.status(409).json({ error: 'Seat is no longer available' });
    }

    // Fetch the updated seat to return it (updateMany doesn't return the row itself)
    const showSeat = await prisma.showSeat.findUnique({ where: { id: showSeatId } });

    res.status(200).json({ message: 'Seat held', showSeat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to hold seat' });
  }
};

const releaseHold = async (req, res) => {
  try {
    const { showSeatId } = req.params;

    // Only release if it's actually held — don't accidentally touch AVAILABLE or BOOKED seats
    const result = await prisma.showSeat.updateMany({
      where: {
        id: showSeatId,
        status: 'HELD',
      },
      data: {
        status: 'AVAILABLE',
        holdExpiresAt: null,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'No active hold found for this seat' });
    }

    res.json({ message: 'Hold released' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to release hold' });
  }
};

module.exports = { createHold, releaseHold };