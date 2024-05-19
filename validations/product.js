const { query, param } = require('express-validator');

exports.validateGetProducts = [
  query('query')
    .optional()
    .isString()
    .withMessage('Query must be a string'),
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  query('priceMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('PriceMin must be a positive number'),
  query('priceMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('PriceMax must be a positive number'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer')
];


exports.validateGetProductsBySearch = [
  query('query')
    .notEmpty()
    .withMessage('Query is required')
    .isString()
    .withMessage('Query must be a string')
];

