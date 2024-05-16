const { addToCart, getCart, deleteCartItemById } = require('../controllers/cart');
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


router
    .delete(
        '/cart/:cartItemId',
        isAuthorized,
        deleteCartItemById
    );


module.exports = router;