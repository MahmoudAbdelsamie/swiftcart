const { addProduct, getProducts, editProduct, getProductById } = require('../controllers/product');

const router = require('express').Router();

router.get('/products', getProducts);

router.post('/product', addProduct)

router
    .route('/product/:id')
    .put(editProduct)
    .get(getProductById)


module.exports = router;