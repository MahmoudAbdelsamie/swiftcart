const { addToWishlist, getWishlist, deleteWishlistItem } = require('../controllers/wishlist');
const { isAuthorized } = require('../middlewares/user');
const { handleValidationErrors } = require('../middlewares/validator');
const { validateAddToWishlist, validateDeleteWishlistItem } = require('../validations/wishlist');

const router = require('express').Router();


router.post('/wishlist', isAuthorized, validateAddToWishlist, handleValidationErrors, addToWishlist);

router.get('/wishlist', isAuthorized, getWishlist);

router.delete('/wishlist/:itemId', isAuthorized, validateDeleteWishlistItem, handleValidationErrors, deleteWishlistItem)


module.exports = router;