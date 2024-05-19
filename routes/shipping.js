const { addShipping } = require('../controllers/shipping');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();

router.post('/shipping', isAuthorized, addShipping);


module.exports = router;