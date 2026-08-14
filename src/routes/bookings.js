const express = require('express');
const router = express.Router();
const { createBooking, mockPayment } = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createBooking);
router.post('/:bookingId/mock-payment', requireAuth, mockPayment);

module.exports = router;