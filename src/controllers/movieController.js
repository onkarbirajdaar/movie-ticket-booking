
const prisma = require('../config/prisma');
const getMovies = async (req, res) => {
     try {
      const movies = await prisma.movie.findMany();
      res.json(movies);
      
     } catch (error) {
      console.error(error);
      res.status(500).json({error: 'Failed to fetch movies'});
      
     }
   };
   
   const getMovieById = async (req, res) => {
    try {
      const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
      if(!movie) return res.status(404).json({error: "Movie not found"});
      res.json(movie);


    } catch (error) {
      console.error(error);
      res.status(500).json({error: "Failed to fetch movie"});
      
    }
   };

   const createMovie = async (req, res) => {
    try {
      const {title, synopsis, durationMinutes, language, posterURL, status } =req.body;
      const movie = await prisma.movie.create({
        data:{title, synopsis, durationMinutes, language, posterURL, status},
      });
      res.status(201).json(movie);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create movie' });
      
    }
   };

   const updateMovie = async (req, res) =>{
    try {
      const movie = await prisma.movie.update({
        where: {id: req.params.id},
        data:req.body,
      });
      res.json(movie);
    } catch (error) {
      console.error(error);
    res.status(500).json({ error: 'Failed to update movie' });
      
    }
   };

   const deleteMovie = async (req, res) => {
    try {
      await prisma.movie.delete({where: {id: req.params.id}});
      res.status(204).send();
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete movie' });
      
    }
   }


module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };