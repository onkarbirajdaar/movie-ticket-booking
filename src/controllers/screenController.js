const prisma = require('../config/prisma');

const getScreens = async (req, res) => {
  try {
    const { theatreId } = req.query;
    const screens = await prisma.screen.findMany({
      where: theatreId ? { theatreId } : undefined,
    });
    res.json(screens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch screens' });
  }
};

const createScreen = async (req, res) => {
  try {
    const { theatreId, name, format, totalSeats } = req.body;
    const screen = await prisma.screen.create({
      data: { theatreId, name, format, totalSeats },
    });
    res.status(201).json(screen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create screen' });
  }
};

module.exports = { getScreens, createScreen };