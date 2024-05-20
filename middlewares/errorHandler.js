const { AppError } = require("../utils/errors");

exports.errorHandler = (err, req, res, next) => {
  if (!err.isOperational) {
    console.error("Unexpected Error:", err);
    return res.status(500).send({
      status: "error",
      message: "Something went wrong!",
    });
  }

  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
};
