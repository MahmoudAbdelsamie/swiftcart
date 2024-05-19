const { addToWishlist, getWishlist, deleteWishlistItem } = require('../controllers/wishlist');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router.post('/wishlist', isAuthorized, addToWishlist);

router.get('/wishlist', isAuthorized, getWishlist);

router.delete('/wishlist/:itemId', isAuthorized, deleteWishlistItem)


module.exports = router;