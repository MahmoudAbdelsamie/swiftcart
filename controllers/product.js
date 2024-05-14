const pool = require("../config/database");






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