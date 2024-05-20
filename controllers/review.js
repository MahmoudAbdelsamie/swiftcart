const pool = require("../config/database");
const { NotFoundError, AppError } = require("../utils/errors");



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
        return next(new AppError(err.message, 500))
    }
}

exports.getReviews = async (req, res, next) => {
    const { productId } = req.params;
    const query = `
        SELECT 
            r.id AS review_id,
            r.rating,
            r.comment,
            r.created_at,
            u.id AS user_id,
            u.username
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC;
    `;

    try {
        const reviewsResult = await pool.query(query, [productId]);
        if(reviewsResult.rowCount < 1) {
            return next(new NotFoundError('No Reviews Found'))
        }
        const reviews = reviewsResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Reviews Retrieved',
            data: reviews
        })

    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}




