const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return next(new ValidationError(errors.array().map(err => err.msg).join(', ')));
  };
};
