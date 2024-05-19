const { body, param } = require('express-validator');

exports.validateAddShipping = [
  body('street')
    .notEmpty()
    .withMessage('Street is required')
    .isString()
    .withMessage('Street must be a string'),
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string'),
  body('state')
    .notEmpty()
    .withMessage('State is required')
    .isString()
    .withMessage('State must be a string'),
  body('zip')
    .notEmpty()
    .withMessage('Zip is required')
    .isPostalCode('any')
    .withMessage('Zip must be a valid postal code'),
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .isString()
    .withMessage('Country must be a string')
];

exports.validateGetShippingStatus = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isInt({ gt: 0 })
    .withMessage('Order ID must be a positive integer')
];
