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
