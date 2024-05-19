const { addShipping, getShippingStatus } = require("../controllers/shipping");
const { isAuthorized } = require("../middlewares/user");
const { handleValidationErrors } = require("../middlewares/validator");
const {
  validateAddShipping,
  validateGetShippingStatus,
} = require("../validations/shipping");

const router = require("express").Router();

router.post(
  "/shipping",
  isAuthorized,
  validateAddShipping,
  handleValidationErrors,
  addShipping
);

router.get(
  "/shipping/status/:orderId",
  isAuthorized,
  validateGetShippingStatus,
  handleValidationErrors,
  getShippingStatus
);

module.exports = router;
