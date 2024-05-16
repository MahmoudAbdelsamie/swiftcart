const { addToCart, getCart } = require('../controllers/cart');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();

router
    .route('/cart')
    .post(
        isAuthorized,
        addToCart
    )
    .get(
        isAuthorized,
        getCart
    )


module.exports = router;