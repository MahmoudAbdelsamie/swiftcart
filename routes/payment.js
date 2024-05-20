const {
  createPaymentIntent,
  confirmPayment,
} = require("../controllers/payment");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const {
  validateCreatePaymentIntent,
  validateConfirmPayment,
} = require("../validations/payment");

const router = require("express").Router();

router.post(
  "/create-payment-intent",
  isAuthorized,
  validate(validateCreatePaymentIntent),
  createPaymentIntent
);

router.post(
  "/orders/:orderId/pay",
  isAuthorized,
  validate(validateConfirmPayment),
  confirmPayment
);

module.exports = router;
