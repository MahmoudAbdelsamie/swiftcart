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
const { handleValidationErrors } = require("../middlewares/validator");
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
  validateRegister,
  handleValidationErrors,
  register
);

router.post("/user/login", validateLogin, handleValidationErrors, login);

// Update Password
router.put(
  "/user/password",
  isAuthorized,
  validateUpdatePassword,
  handleValidationErrors,
  updatePassword
);

// Forget Password Management
router.post(
  "/user/password-reset/request",
  validateForgetPasswordRequest,
  handleValidationErrors,
  forgetPasswordRequest
);
router.post(
  "/user/password-reset/verify",
  validateVerifyForgetPassword,
  handleValidationErrors,
  verifyForgetPassword
);

// Profile Management
router
  .route("/user/profile")
  .get(isAuthorized, getUserProfile)
  .put(
    isAuthorized,
    validateUpdateUserProfile,
    handleValidationErrors,
    updateUserProfile
  );

module.exports = router;
