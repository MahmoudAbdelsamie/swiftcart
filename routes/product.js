const {
  addProduct,
  getProducts,
  editProduct,
  getProductById,
  deleteProduct,
  getProductsBySearch,
} = require("../controllers/product");

const router = require("express").Router();

router.get("/products", getProducts);
router.get("/products/search", getProductsBySearch);

router.post("/product", addProduct);

router
  .route("/product/:id")
  .get(getProductById)
  .put(editProduct)
  .delete(deleteProduct);

module.exports = router;
