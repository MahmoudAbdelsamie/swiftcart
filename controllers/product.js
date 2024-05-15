const pool = require("../config/database");

exports.getProducts = async (req, res, next) => {
    const query = 'SELECT * FROM products;';

    try {
        const products = await pool.query(query);
        if(products.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Products Found!'
            })
        }
        return res.status(200).send({
            status: 'success',
            message: 'Products Retrieved',
            data: products.rows
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

exports.addProduct = async (req, res, next) => {
    const query = 'INSERT INTO products (name, description, price, stock, category_id) VALUES ($1, $2, $3, $4, $5)';
    try {
        const {
            name,
            description, 
            price,
            stock,
            category_id
        } = req.body;
        await pool.query(query, [name, description, price, stock, category_id]);
        return res.status(201).send({
            status: 'success',
            message: 'Product Added'
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

exports.editProduct = async (req, res, next) => {
    const query = 'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5 WHERE id=$6;';
    const productQuery = 'SELECT * FROM products WHERE id=$1;'
    try {
        const {
            name,
            description, 
            price,
            stock,
            category_id 
        } = req.body;
        const { id } = req.params;
        const product = await pool.query(productQuery, [id]);
        if(product.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Product Found!'
            })
        }
        await pool.query(query, [name, description, price, stock, category_id, id]);
        return res.status(200).send({
            status: 'success',
            message: 'Product Updated'
        })

    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

exports.getProductById = async (req, res, next) => {
    const query = 'SELECT * FROM products WHERE id=$1;';
    try {
        const { id } = req.params;
        const product = await pool.query(query, [id]);
        if(product.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Product Found!'
            })
        }
        return res.status(200).send({
            status: 'success',
            message: 'Product Retrieved',
            data: product.rows[0]
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

exports.deleteProduct = async (req, res, next) => {
    const query = 'DELETE FROM products WHERE id=$1;';
    try {
        const { id } = req.params;
        await pool.query(query, [id]);
        return res.status(200).send({
            status: 'success',
            message: 'Product Deleted'
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}