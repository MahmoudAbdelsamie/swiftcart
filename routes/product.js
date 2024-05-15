const { addProduct, getProducts, editProduct, getProductById, deleteProduct } = require('../controllers/product');

const router = require('express').Router();

router.get('/products', getProducts);

router.post('/product', addProduct)

router
    .route('/product/:id')
    .get(getProductById)
    .put(editProduct)
    .delete(deleteProduct)


module.exports = router;