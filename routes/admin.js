const multer = require('multer');

const { getUsers, getUserById, deleteUserById, addProduct, updateProduct, deleteProductById } = require("../controllers/admin");
const { isAdmin } = require("../middlewares/admin");
const { isAuthorized } = require("../middlewares/user");

const router = require("express").Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

// POST Add-Product
router.post('/admin/products', isAuthorized, isAdmin, upload.single("image"), addProduct);
// PUT Update-Product
router.put('/admin/products/:id', isAuthorized, isAdmin, upload.single("image"), updateProduct);
// DELETE product
router.delete('/admin/products/:id', isAuthorized, isAdmin, deleteProductById)



// Get All Users
router.get('/admin/users', isAuthorized, isAdmin, getUsers);
// Get User By Id 
router.get('/admin/users/:id', isAuthorized, isAdmin, getUserById);
// Delete User By id
router.delete('/admin/users/:id', isAuthorized, isAdmin, deleteUserById);

module.exports = router;