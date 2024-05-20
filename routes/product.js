const {
  getProducts,
  getProductById,
  getProductsBySearch,
  getProductCategories,
} = require("../controllers/product");
const { validate } = require("../middlewares/validator");
const { validateParamsId } = require("../validations/admin");
const {
  validateGetProducts,
  validateGetProductsBySearch,
} = require("../validations/product");
const { cache } = require('../middlewares/cache');
 
const router = require("express").Router();

router.get("/products", validate(validateGetProducts), cache, getProducts);
router.get(
  "/products/search",
  validate(validateGetProductsBySearch),
  getProductsBySearch
);

router.get("/products/categories", cache, getProductCategories);

router.route("/product/:id").get(validate(validateParamsId), getProductById);

module.exports = router;
