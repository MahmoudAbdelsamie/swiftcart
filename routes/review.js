const { addReview, getReviews } = require('../controllers/review');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router.post('/reviews', isAuthorized, addReview)

router.get('/reviews/:productId', isAuthorized, getReviews)

module.exports = router;