const pool = require("../config/database");



exports.addReview = async (req, res, next) => {
    const userId = req.user.id;
    const {
        productId,
        rating,
        comment
    } = req.body;
    const query = `
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [userId, productId, rating, comment]);
        const newReview = result.rows[0];

        return res.status(201).send({
            status: 'success',
            message: 'Review Created',
            data: newReview
        });
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        });
    }
}
