const { createOrder, getOrderDetails } = require('../controllers/order');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router
    .route('/orders')
    .post(
        isAuthorized,
        createOrder
    )

router
    .route('/orders/:id')
    .get(
        isAuthorized,
        getOrderDetails
    )

module.exports = router;