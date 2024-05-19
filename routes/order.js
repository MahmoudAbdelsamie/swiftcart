const {
  createOrder,
  getOrderDetails,
  getUserOrders,
  getOrderConfirm,
} = require("../controllers/order");
const { isAuthorized } = require("../middlewares/user");

const router = require("express").Router();

router.route("/orders").post(isAuthorized, createOrder);

router.route("/orders/:id").get(isAuthorized, getOrderDetails);

router.get("/user/orders", isAuthorized, getUserOrders);

router.get('/orders/confirm/:orderId', isAuthorized, getOrderConfirm)

module.exports = router;
