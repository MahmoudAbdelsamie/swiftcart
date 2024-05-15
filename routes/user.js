const { register, login } = require('../controllers/user');

const router = require('express').Router();

router.post('/user/register', register)

router.post('/user/login', login)


module.exports = router;