const { getUsers, getUserById, deleteUserById } = require("../controllers/admin");
const { isAdmin } = require("../middlewares/admin");
const { isAuthorized } = require("../middlewares/user");

const router = require("express").Router();

router.get('/admin/users', isAuthorized, isAdmin, getUsers);
router.get('/admin/users/:id', isAuthorized, isAdmin, getUserById);
router.delete('/admin/users/:id', isAuthorized, isAdmin, deleteUserById);

module.exports = router;