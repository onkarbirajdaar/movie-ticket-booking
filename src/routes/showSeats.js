const express = require('express');
const router = express.Router();
const { generateShowSeats, getShowSeats } = require('../controllers/showSeatController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/shows/:showId/generate', requireAuth, requireAdmin, generateShowSeats);
router.get('/shows/:showId', getShowSeats);

module.exports = router;