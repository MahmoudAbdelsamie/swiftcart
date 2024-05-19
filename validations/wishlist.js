const { body, param } = require('express-validator');

exports.validateAddToWishlist = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be an integer')
];

exports.validateDeleteWishlistItem = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isInt()
    .withMessage('Item ID must be an integer')
];
