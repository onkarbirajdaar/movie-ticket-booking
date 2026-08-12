const express = require('express');
const router = express.Router();
const { getShows, createShow } = require('../controllers/showController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', getShows);
router.post('/', requireAuth, requireAdmin, createShow);

module.exports = router;