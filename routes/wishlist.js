const { addToWishlist, getWishlist } = require('../controllers/wishlist');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router.post('/wishlist', isAuthorized, addToWishlist);

router.get('/wishlist', isAuthorized, getWishlist);

module.exports = router;