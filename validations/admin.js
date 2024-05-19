const { param, body, check } = require("express-validator");

exports.validateParamsId = [
  param("id").isInt().withMessage("Params Id Must be Aa integer"),
];

exports.validateAddProduct = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ gt: 0 })
    .withMessage("Stock must be a positive integer"),
  body("category_id").isInt().withMessage("Category ID must be an integer"),
];

