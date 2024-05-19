const { createPaymentIntent, confirmPayment } = require('../controllers/payment');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();


router.post('/create-payment-intent', isAuthorized, createPaymentIntent);

router.post('/orders/:orderId/pay', isAuthorized, confirmPayment)


module.exports = router;