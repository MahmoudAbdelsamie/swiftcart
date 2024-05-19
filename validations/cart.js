const { body, param } = require('express-validator');

exports.validateAddToCart = [
  body('productId').isInt().withMessage('Product ID must be an integer'),
  body('quantity').optional().isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
];


exports.validateDeleteCartItemById = [
    param('cartItemId').isInt().withMessage('Cart Item ID must be an integer')
  ];