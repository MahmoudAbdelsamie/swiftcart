const { addShipping, getShippingStatus } = require('../controllers/shipping');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();

router.post('/shipping', isAuthorized, addShipping);

router.get('/shipping/status/:orderId', isAuthorized, getShippingStatus);

module.exports = router;