const {
  createOrder,
  getOrderDetails,
  getUserOrders,
  getOrderConfirm,
  getOrderTrack,
  getOrdersHistory,
} = require("../controllers/order");
const { isAuthorized } = require("../middlewares/user");
const { handleValidationErrors } = require("../middlewares/validator");
const { validateParamsId } = require("../validations/admin");
const { validateCreateOrder, validateParamOrderId } = require("../validations/order");

const router = require("express").Router();

router.route("/orders").post(isAuthorized, validateCreateOrder, handleValidationErrors, createOrder);

router.get('/orders/history', isAuthorized, getOrdersHistory);

router.route("/orders/:id").get(isAuthorized, validateParamsId, handleValidationErrors, getOrderDetails);

router.get("/user/orders", isAuthorized, getUserOrders);

router.get('/orders/confirm/:orderId', isAuthorized, validateParamOrderId, handleValidationErrors, getOrderConfirm);

router.get('/orders/track/:orderId', isAuthorized, validateParamOrderId, handleValidationErrors, getOrderTrack);



module.exports = router;
