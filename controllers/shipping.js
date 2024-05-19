const pool = require("../config/database");


exports.addShipping = async (req, res, next) => {
    const userId = req.user.id;
    const {
        street,
        city,
        state,
        zip,
        country
    } = req.body;
    const query = `
        INSERT INTO addresses (user_id, street, city, state, zip, country)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    try {
        const addressResult = await pool.query(query, [userId, street, city, state, zip, country]);
        const newAddress = addressResult.rows[0];
        return res.status(201).send({
            status: 'success',
            message: 'Shipping Address Created',
            data: newAddress
        })
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        });
    }
};


exports.getShippingStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const query = `
        SELECT 
            s.status, 
            s.tracking_number, 
            s.estimated_delivery, 
            s.created_at, 
            o.total, 
            o.status AS order_status, 
            a.street, 
            a.city, 
            a.state, 
            a.zip, 
            a.country 
        FROM shipments s
        JOIN orders o ON s.order_id = o.id
        JOIN addresses a ON o.shipping_address_id = a.id
        WHERE s.order_id = $1;
    `;
    try {
        const result = await pool.query(query, [orderId]);
        if(result.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Shipping Information Found!'
            })
        }
        const shippingStatus = result.rows[0];
        return res.status(200).send({
            status: 'success',
            message: 'Shipping Status Retrieved',
            data: shippingStatus
        })
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        });
    }
}
