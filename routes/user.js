const { register, login, getUserProfile, updateUserProfile, updatePassword } = require('../controllers/user');
const { isAuthorized } = require('../middlewares/user');

const router = require('express').Router();

router.post('/user/register', register)

router.post('/user/login', login);

router.put('/user/password', isAuthorized, updatePassword)


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