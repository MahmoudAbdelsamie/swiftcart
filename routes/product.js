const { addProduct } = require('../controllers/product');

const router = require('express').Router();


router
    .route('/product')
    .post(addProduct)

    
module.exports = router;