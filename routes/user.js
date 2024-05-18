const { register, login, getUserProfile } = require('../controllers/user');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();

router.post('/user/register', register)

router.post('/user/login', login);

router.get('/user/profile', isAuthorized, getUserProfile);



module.exports = router;