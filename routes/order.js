const {
  createOrder,
  getOrderDetails,
  getUserOrders,
  getOrderConfirm,
  getOrderTrack,
  getOrdersHistory,
} = require("../controllers/order");
const { isAuthorized } = require("../middlewares/user");

const router = require("express").Router();

router.route("/orders").post(isAuthorized, createOrder);

router.get('/orders/history', isAuthorized, getOrdersHistory);

router.route("/orders/:id").get(isAuthorized, getOrderDetails);

router.get("/user/orders", isAuthorized, getUserOrders);

// router.get('/orders/history', isAuthorized, getOrdersHistory);

router.get('/orders/confirm/:orderId', isAuthorized, getOrderConfirm);

router.get('/orders/track/:orderId', isAuthorized, getOrderTrack);



module.exports = router;
