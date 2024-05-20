const { addToWishlist, getWishlist, deleteWishlistItem } = require('../controllers/wishlist');
const { isAuthorized } = require('../middlewares/user');
const { validate } = require('../middlewares/validator');
const { validateAddToWishlist, validateDeleteWishlistItem } = require('../validations/wishlist');

const router = require('express').Router();


router.post('/wishlist', isAuthorized, validate(validateAddToWishlist), addToWishlist);

router.get('/wishlist', isAuthorized, getWishlist);

router.delete('/wishlist/:itemId', isAuthorized, validate(validateDeleteWishlistItem), deleteWishlistItem)


module.exports = router;