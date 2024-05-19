const pool = require("../config/database");


exports.addToWishlist = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.body;
    const query = `
        INSERT INTO wishlist (user_id, product_id)
        VALUES ($1, $2)
        RETURNING id;
    `;
    try {
        const result = await pool.query(query, [userId, productId]);
        return res.status(201).send({
            status: 'success',
            message: 'Product Added To Wishlist',
            data: result.rows[0]
        })

    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        });
    }
}
