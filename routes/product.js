const { addProduct, getProducts } = require('../controllers/product');

const router = require('express').Router();

router
    .get('/products', getProducts)

router
    .route('/product')
    .post(addProduct)


module.exports = router;