const express = require('express');
const router = express.Router();
const { getScreens, createScreen } = require('../controllers/screenController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', getScreens);
router.post('/', requireAuth, requireAdmin, createScreen);

module.exports = router;