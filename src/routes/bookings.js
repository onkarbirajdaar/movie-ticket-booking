const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createBooking);

module.exports = router;