const { register, login, getUserProfile, updateUserProfile, updatePassword, forgetPasswordRequest, verifyForgetPassword } = require('../controllers/user');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();

router.post('/user/register', register)

router.post('/user/login', login);

// Update Password
router.put('/user/password', isAuthorized, updatePassword)

// Forget Password Management
router.post('/user/password-reset/request', forgetPasswordRequest);
router.post('/user/password-reset/verify', verifyForgetPassword)

// Profile Management
router
    .route('/user/profile')
    .get(
        isAuthorized,
        getUserProfile
    )
    .put(
        isAuthorized,
        updateUserProfile
    )




module.exports = router;