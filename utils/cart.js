const pool = require("../config/database");


exports.getOrCreateCart = async (userId) => {
    const getCartQuery = 'SELECT id FROM carts WHERE user_id = $1 AND created_at >= NOW() - INTERVAL \'24 hours\'';
    const createCartQuery = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING id';
    let cart = await pool.query(getCartQuery, [userId]);

    if (cart.rowCount < 1) {
        cart = await pool.query(createCartQuery, [userId]);
    }
    return cart.rows[0].id;
} 