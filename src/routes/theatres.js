const express = require('express');
const router = express.Router();
const { getTheatres, createTheatre, updateTheatre, deleteTheatre } = require('../controllers/theatreController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', getTheatres);
router.post('/', requireAuth, requireAdmin, createTheatre);
router.put('/:id', requireAuth, requireAdmin, updateTheatre);
router.delete('/:id', requireAuth, requireAdmin, deleteTheatre);

module.exports = router;