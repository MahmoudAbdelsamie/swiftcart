const { body, param } = require('express-validator');

exports.validateAddReview = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .optional()
    .isString()
    .withMessage('Comment must be a string')
];




exports.validateGetReviews = [
  param('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
];
