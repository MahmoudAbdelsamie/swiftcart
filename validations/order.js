const { body, param } = require('express-validator');

exports.validateCreateOrder = [
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street is required')
    .isString()
    .withMessage('Street must be a string'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required')
    .isString()
    .withMessage('State must be a string'),
  body('shippingAddress.zip')
    .notEmpty()
    .withMessage('ZIP code is required')
    .isString()
    .withMessage('ZIP code must be a string'),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required')
    .isString()
    .withMessage('Country must be a string'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isString()
    .withMessage('Payment method must be a string')
];



exports.validateParamOrderId = [
  param('orderId')
    .isInt({ gt: 0 })
    .withMessage('Order ID must be a positive integer')
];