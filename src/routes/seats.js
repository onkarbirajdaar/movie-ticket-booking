const express = require('express');
const router = express.Router();
const { generateSeats, getSeatsByScreen } = require('../controllers/seatController');
const {requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/screens/:screenId/generate', requireAuth, requireAdmin, generateSeats);
router.get('/screens/:screenId', getSeatsByScreen);

module.exports= router;