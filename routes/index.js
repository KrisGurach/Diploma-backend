const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../helpers/errors/notFoundError');

router.post('/signin', login);

router.post('/signup', createUser);

// router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((_, __, next) => next(new NotFoundError('Not found')));

module.exports = router;
