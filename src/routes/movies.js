const express = require('express');
   const router = express.Router();
   const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
   const {requireAuth, requireAdmin } =require('../middleware/auth');
   router.get('/', getMovies);
   router.get('/:id', getMovieById);
   router.post('/', requireAuth, requireAdmin, createMovie);
   router.post('/:id', requireAuth, requireAdmin, updateMovie);
   router.post('/:id', requireAuth, requireAdmin, deleteMovie);

   module.exports = router;