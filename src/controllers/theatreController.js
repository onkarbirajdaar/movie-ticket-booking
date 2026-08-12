const prisma = require('../config/prisma');

const getTheatres = async (req, res) => {
  try {
    const { cityId } = req.query;
    const theatres = await prisma.theatre.findMany({
      where: cityId ? { cityId } : undefined,
    });
    res.json(theatres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch theatres' });
  }
};

const createTheatre = async (req, res) => {
  try {
    const { cityId, name, address, amenities } = req.body;
    const theatre = await prisma.theatre.create({
      data: { cityId, name, address, amenities },
    });
    res.status(201).json(theatre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create theatre' });
  }
};

const updateTheatre = async (req, res) => {
  try {
    const theatre = await prisma.theatre.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(theatre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update theatre' });
  }
};

const deleteTheatre = async (req, res) => {
  try {
    await prisma.theatre.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete theatre' });
  }
};

module.exports = { getTheatres, createTheatre, updateTheatre, deleteTheatre };