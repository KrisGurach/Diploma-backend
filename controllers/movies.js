const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { createSuccessStatusCode } = require('../helpers/constantsHelpers');
const ValidationError = require('../helpers/errors/validationError');
const ServerError = require('../helpers/errors/serverError');
const ForbiddenError = require('../helpers/errors/forbiddenError');
const NotFoundError = require('../helpers/errors/notFoundError');

const getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((data) => res.status(createSuccessStatusCode).send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(new ServerError());
      }
    });
};

const deleteMovie = (req, res, next) => {
  const id = req.params._id;

  Movie.findById(id)
    .orFail(() => next(new NotFoundError(`Фильм с указанным id = ${id} не найден.`)))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Можно удалять только собственные фильмы.'));
      }

      Movie.deleteOne(movie)
        .orFail()
        .then((data) => res.send(data))
        .catch(next);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new ValidationError('Переданы некорректные данные при удалении фильма.'));
      } else {
        next(new ServerError());
      }
    });
};

module.exports = { getAllMovies, createMovie, deleteMovie };
