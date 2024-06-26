const multer = require("multer");

const {
  getUsers,
  getUserById,
  deleteUserById,
  addProduct,
  updateProduct,
  deleteProductById,
  getProducts,
  getOrders,
  getSalesReports,
} = require("../controllers/admin");
const { getProductById } = require("../controllers/product");
const { isAdmin } = require("../middlewares/admin");
const { cache } = require("../middlewares/cache");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const {
  validateParamsId,
  validateAddProduct,
} = require("../validations/admin");


const router = require("express").Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

// POST Add-Product
router.post(
  "/admin/products",
  isAuthorized,
  isAdmin,
  upload.single("image"),
  validate(validateAddProduct),
  addProduct
);

// PUT Update-Product
router.put(
  "/admin/products/:id",
  isAuthorized,
  isAdmin,
  upload.single("image"),
  validate(validateParamsId),
  validate(validateAddProduct),
  updateProduct
);

// DELETE product
router.delete(
  "/admin/products/:id",
  isAuthorized,
  isAdmin,
  validate(validateParamsId),
  deleteProductById
);

// GET Products
router.get("/admin/products", isAuthorized, cache, isAdmin, getProducts);

// GET Specific Prodcut
router.get(
  "/admin/products/:id",
  isAuthorized,
  isAdmin,
  validate(validateParamsId),
  getProductById
);

// Get All Orders
router.get("/admin/orders", isAuthorized, cache, isAdmin, getOrders);

// Get All Users
router.get("/admin/users", isAuthorized, isAdmin, getUsers);

// Get User By Id
router.get(
  "/admin/users/:id",
  isAuthorized,
  isAdmin,
  validate(validateParamsId),
  getUserById
);

// Delete User By id
router.delete(
  "/admin/users/:id",
  isAuthorized,
  isAdmin,
  validate(validateParamsId),
  deleteUserById
);

// Get Sales Reports
router.get("/admin/reports/sales", isAuthorized, isAdmin, getSalesReports);

module.exports = router;
