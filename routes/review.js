const { addReview, getReviews } = require("../controllers/review");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const {
  validateAddReview,
  validateGetReviews,
} = require("../validations/review");

const router = require("express").Router();

router.post("/reviews", isAuthorized, validate(validateAddReview), addReview);

router.get(
  "/reviews/:productId",
  isAuthorized,
  validate(validateGetReviews),
  getReviews
);

module.exports = router;
