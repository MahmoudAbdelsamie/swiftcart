const { param, body } = require('express-validator');


exports.validateCreatePaymentIntent = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isInt({ gt: 0 })
    .withMessage('Order ID must be a positive integer')
];



exports.validateConfirmPayment = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isInt({ gt: 0 })
    .withMessage('Order ID must be a positive integer'),
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment Intent ID is required')
    .isString()
    .withMessage('Payment Intent ID must be a string')
];
