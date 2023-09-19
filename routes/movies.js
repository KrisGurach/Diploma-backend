const router = require('express').Router();

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getAllMovies);

router.post('/', createMovie);

router.delete('/:_id', deleteMovie);

module.exports = router;
