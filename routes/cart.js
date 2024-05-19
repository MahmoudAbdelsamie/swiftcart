const {
  addToCart,
  getCart,
  deleteCartItemById,
} = require("../controllers/cart");
const { isAuthorized } = require("../middlewares/user");
const { handleValidationErrors } = require("../middlewares/validator");
const {
  validateAddToCart,
  validateDeleteCartItemById,
} = require("../validations/cart");

const router = require("express").Router();

router
  .route("/cart")
  .post(isAuthorized, validateAddToCart, handleValidationErrors, addToCart)
  .get(isAuthorized, getCart);

router.delete(
  "/cart/:cartItemId",
  isAuthorized,
  validateDeleteCartItemById,
  handleValidationErrors,
  deleteCartItemById
);

module.exports = router;
