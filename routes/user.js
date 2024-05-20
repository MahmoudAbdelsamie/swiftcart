const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  forgetPasswordRequest,
  verifyForgetPassword,
} = require("../controllers/user");
const { isAuthorized } = require("../middlewares/user");
const { validate } = require("../middlewares/validator");
const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
  validateForgetPasswordRequest,
  validateVerifyForgetPassword,
  validateUpdateUserProfile,
} = require("../validations/user");

const router = require("express").Router();

router.post(
  "/user/register",
  validate(validateRegister),
  register
);

router.post("/user/login", validate(validateLogin), login);

// Update Password
router.put(
  "/user/password",
  isAuthorized,
  validate(validateUpdatePassword),
  updatePassword
);

// Forget Password Management
router.post(
  "/user/password-reset/request",
  validate(validateForgetPasswordRequest),
  forgetPasswordRequest
);
router.post(
  "/user/password-reset/verify",
  validate(validateVerifyForgetPassword),
  verifyForgetPassword
);

// Profile Management
router
  .route("/user/profile")
  .get(isAuthorized, getUserProfile)
  .put(
    isAuthorized,
    validate(validateUpdateUserProfile),
    updateUserProfile
  );

module.exports = router;
