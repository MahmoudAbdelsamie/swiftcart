const { addReview } = require('../controllers/review');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router.post('/reviews', isAuthorized, addReview)



module.exports = router;