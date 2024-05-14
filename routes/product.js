const { addProduct, getProducts, editProduct } = require('../controllers/product');

const router = require('express').Router();

router.get('/products', getProducts)

router.post('/product', addProduct)

router.put('/product/:id', editProduct)

module.exports = router;