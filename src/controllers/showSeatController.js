const prisma = require('../config/prisma');

const generateShowSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const { price = 200 } = req.body; // flat price for now; per-section pricing is a later enhancement

    const show = await prisma.show.findUnique({ where: { id: showId } });
    if (!show) return res.status(404).json({ error: 'Show not found' });

    const existing = await prisma.showSeat.findFirst({ where: { showId } });
    if (existing) {
      return res.status(400).json({ error: 'ShowSeats already generated for this show' });
    }

    const seats = await prisma.seat.findMany({ where: { screenId: show.screenId } });
    if (seats.length === 0) {
      return res.status(400).json({ error: 'No seats exist for this screen — generate seats first' });
    }

    const showSeatsToCreate = seats.map((seat) => ({
      showId,
      seatId: seat.id,
      price,
      status: 'AVAILABLE',
    }));

    const created = await prisma.showSeat.createMany({ data: showSeatsToCreate });
    res.status(201).json({ message: `${created.count} show-seats created` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate show-seats' });
  }
};


const getShowSeats = async (req, res) => {
  try {
    const showSeats = await prisma.showSeat.findMany({
      where: { showId: req.params.showId },
      include: { seat: true },
      orderBy: [{ seat: { rowLabel: 'asc' } }, { seat: { seatNumber: 'asc' } }],
    });

    const now = new Date();
    const withEffectiveStatus = showSeats.map((s) => ({
      ...s,
      status: s.status === 'HELD' && s.holdExpiresAt && s.holdExpiresAt < now
        ? 'AVAILABLE'
        : s.status,
    }));

    res.json(withEffectiveStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch show-seats' });
  }
};


module.exports = { generateShowSeats, getShowSeats };