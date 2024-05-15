const { register } = require('../controllers/user');

const router = require('express').Router();

router.post('/user/register', register)



module.exports = router;