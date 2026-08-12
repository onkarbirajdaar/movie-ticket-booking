const prisma = require('../config/prisma');

const getShows = async (req, res) => {
  try {
    const { movieId, cityId, date } = req.query;

    const where = {};
    if (movieId) where.movieId = movieId;
    if (cityId) where.screen = { theatre: { cityId } };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.startsAt = { gte: start, lt: end };
    }

    const shows = await prisma.show.findMany({
      where,
      include: { movie: true, screen: { include: { theatre: true } } },
    });
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
};

const createShow = async (req, res) => {
  try {
    const { movieId, screenId, startsAt, endsAt, format, language, status } = req.body;
    const show = await prisma.show.create({
      data: {
        movieId, screenId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        format, language, status,
      },
    });
    res.status(201).json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create show' });
  }
};

module.exports = { getShows, createShow };