const express = require('express');
const router = express.Router();
const { createBooking, mockPayment, getMyBookings, getBookingByCode  } = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createBooking);
router.post('/:bookingId/mock-payment', requireAuth, mockPayment);


router.get('/me', requireAuth, getMyBookings);
router.get('/:code', requireAuth, getBookingByCode);

module.exports = router;