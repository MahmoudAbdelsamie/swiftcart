const pool = require("../config/database");
const { NotFoundError, AppError } = require("../utils/errors");


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
        return next(new AppError(err.message, 500))
    }
}


exports.getWishlist = async (req, res, next) => {
    const userId = req.user.id;
    const query = `
        SELECT p.*
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC;
    `;
    try {
        const wishlistResult = await pool.query(query, [userId]);

        if (wishlistResult.rowCount < 1) {
            return next(new NotFoundError('No Wishlist Found'))
        }

        const wishlist = wishlistResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Wishlist Retrieved',
            data: wishlist
        });
    } catch (err) {
        return next(new AppError(err.message, 500))
    }

}

exports.deleteWishlistItem = async (req, res, next) => {
    const userId = req.user.id;
    const { itemId } = req.params;
    const query = `
        DELETE FROM wishlist
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;
    try {
        const wishlistResult = await pool.query(query, [itemId, userId]);

        if (wishlistResult.rowCount < 1) {
            return next(new NotFoundError('No Wishlist Found'))
        }
        const wishlistItem = wishlistResult.rows[0]

        return res.status(200).send({
            status: 'success',
            message: 'Wishlist Item Removed',
            data: wishlistItem
        });
    } catch (err) {
        return next(new AppError(err.message, 500))
    }

}