const { createOrder } = require('../controllers/order');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router
    .route('/orders')
    .post(
        isAuthorized,
        createOrder
    )

module.exports = router;