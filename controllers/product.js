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