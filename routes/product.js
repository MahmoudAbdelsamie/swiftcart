const {
  addProduct,
  getProducts,
  editProduct,
  getProductById,
  deleteProduct,
  getProductsBySearch,
  getProductCategories,
} = require("../controllers/product");

const router = require("express").Router();

router.get("/products", getProducts);
router.get("/products/search", getProductsBySearch);

router.get('/products/categories', getProductCategories)

router.post("/product", addProduct);

router
  .route("/product/:id")
  .get(getProductById)
  .put(editProduct)
  .delete(deleteProduct);

module.exports = router;
