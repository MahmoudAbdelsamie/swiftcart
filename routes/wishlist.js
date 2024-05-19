const { addToWishlist } = require('../controllers/wishlist');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router.post('/wishlist', isAuthorized, addToWishlist);


module.exports = router;