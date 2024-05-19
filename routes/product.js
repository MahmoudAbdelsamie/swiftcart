const {
  getProducts,
  getProductById,
  getProductsBySearch,
  getProductCategories,
} = require("../controllers/product");
const { handleValidationErrors } = require("../middlewares/validator");
const { validateParamsId } = require("../validations/admin");
const { validateGetProducts, validateGetProductsBySearch } = require("../validations/product");

const router = require("express").Router();

router.get("/products", validateGetProducts, handleValidationErrors, getProducts);
router.get("/products/search", validateGetProductsBySearch, handleValidationErrors, getProductsBySearch);


router.get('/products/categories', getProductCategories)

router
  .route("/product/:id")
  .get(
    validateParamsId,
    handleValidationErrors,
    getProductById)

module.exports = router;
