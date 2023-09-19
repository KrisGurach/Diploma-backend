const router = require('express').Router();

const { getCurrentUserById, updateUser } = require('../controllers/users');

router.get('/me', getCurrentUserById);

router.patch('/me', updateUser);

module.exports = router;
