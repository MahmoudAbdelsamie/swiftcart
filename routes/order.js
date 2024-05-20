const {
  createOrder,
  getOrderDetails,
  getUserOrders,
  getOrderConfirm,
  getOrderTrack,
  getOrdersHistory,
} = require("../controllers/order");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const { validateParamsId } = require("../validations/admin");
const { validateCreateOrder, validateParamOrderId } = require("../validations/order");

const router = require("express").Router();

router.route("/orders").post(isAuthorized, validate(validateCreateOrder), createOrder);

router.get('/orders/history', isAuthorized, getOrdersHistory);

router.route("/orders/:id").get(isAuthorized, validate(validateParamsId), getOrderDetails);

router.get("/user/orders", isAuthorized, getUserOrders);

router.get('/orders/confirm/:orderId', isAuthorized, validate(validateParamOrderId), getOrderConfirm);

router.get('/orders/track/:orderId', isAuthorized, validate(validateParamOrderId), getOrderTrack);



module.exports = router;
