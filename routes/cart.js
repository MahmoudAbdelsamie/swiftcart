const {
  addToCart,
  getCart,
  deleteCartItemById,
} = require("../controllers/cart");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const {
  validateAddToCart,
  validateDeleteCartItemById,
} = require("../validations/cart");

const router = require("express").Router();

router
  .route("/cart")
  .post(isAuthorized, validate(validateAddToCart), addToCart)
  .get(isAuthorized, getCart);

router.delete(
  "/cart/:cartItemId",
  isAuthorized,
  validate(validateDeleteCartItemById),
  deleteCartItemById
);

module.exports = router;
