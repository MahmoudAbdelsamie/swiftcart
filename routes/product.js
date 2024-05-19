const {
  getProducts,
  getProductById,
  getProductsBySearch,
  getProductCategories,
} = require("../controllers/product");

const router = require("express").Router();

router.get("/products", getProducts);
router.get("/products/search", getProductsBySearch);


router.get('/products/categories', getProductCategories)

router
  .route("/product/:id")
  .get(getProductById)


module.exports = router;
