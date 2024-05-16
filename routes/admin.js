const { getUsers } = require("../controllers/admin");
const { isAdmin } = require("../middlewares/admin");
const { isAuthorized } = require("../middlewares/user");

const router = require("express").Router();

router.get('/admin/users', isAuthorized, isAdmin, getUsers);


module.exports = router;