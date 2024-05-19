const { addReview, getReviews } = require("../controllers/review");
const { isAuthorized } = require("../middlewares/user");
const { handleValidationErrors } = require("../middlewares/validator");
const {
  validateAddReview,
  validateGetReviews,
} = require("../validations/review");

const router = require("express").Router();

router.post(
  "/reviews",
  isAuthorized,
  validateAddReview,
  handleValidationErrors,
  addReview
);

router.get(
  "/reviews/:productId",
  isAuthorized,
  validateGetReviews,
  handleValidationErrors,
  getReviews
);

module.exports = router;