const express = require('express');
const router = express.Router();
const { createHold, releaseHold } = require('../controllers/holdController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createHold);
router.delete('/:showSeatId', requireAuth, releaseHold);

module.exports = router;