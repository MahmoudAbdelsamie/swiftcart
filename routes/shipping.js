const { addShipping, getShippingStatus } = require("../controllers/shipping");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const {
  validateAddShipping,
  validateGetShippingStatus,
} = require("../validations/shipping");

const router = require("express").Router();

router.post(
  "/shipping",
  isAuthorized,
  validate(validateAddShipping),
  addShipping
);

router.get(
  "/shipping/status/:orderId",
  isAuthorized,
  validate(validateGetShippingStatus),
  getShippingStatus
);

module.exports = router;
