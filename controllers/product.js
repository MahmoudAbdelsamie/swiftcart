const pool = require("../config/database");

exports.getProducts = async (req, res, next) => {
    const query = 'SELECT * FROM "product";';

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
            message: 'Products Retrieved Successfully',
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
    const query = 'INSERT INTO "product" (name, description, price, stock_qty, category) VALUES ($1, $2, $3, $4, $5);';
    try {
        const {
            name,
            description, 
            price,
            stock_qty,
            category 
        } = req.body;
        await pool.query(query, [name, description, price, stock_qty, category]);
        return res.status(201).send({
            status: 'success',
            message: 'Product Added Successfully'
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
    const query = 'UPDATE "product" SET name=$1, description=$2, price=$3, stock_qty=$4, category=$5 WHERE id=$6;';
    const productQuery = 'SELECT * FROM "product" WHERE id=$1;'
    try {
        const {
            name,
            description, 
            price,
            stock_qty,
            category 
        } = req.body;
        const { id } = req.params;
        const product = await pool.query(productQuery, [id]);
        if(product.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Product Found!'
            })
        }
        await pool.query(query, [name, description, price, stock_qty, category, id]);
        return res.status(200).send({
            status: 'success',
            message: 'Product Updated Successfully'
        })

    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}