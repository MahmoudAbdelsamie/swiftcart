const {
  createPaymentIntent,
  confirmPayment,
} = require("../controllers/payment");
const { isAuthorized } = require("../middlewares/user");
const { handleValidationErrors } = require("../middlewares/validator");
const {
  validateCreatePaymentIntent,
  validateConfirmPayment,
} = require("../validations/payment");

const router = require("express").Router();

router.post(
  "/create-payment-intent",
  isAuthorized,
  validateCreatePaymentIntent,
  handleValidationErrors,
  createPaymentIntent
);

router.post(
  "/orders/:orderId/pay",
  isAuthorized,
  validateConfirmPayment,
  handleValidationErrors,
  confirmPayment
);

module.exports = router;
