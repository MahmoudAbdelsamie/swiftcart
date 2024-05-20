require('dotenv').config();
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const { UnauthorizedError, AppError } = require("../utils/errors");

exports.isAuthorized = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return next(new UnauthorizedError());
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if(err) {
            return next(new UnauthorizedError(err.message));
        }
        const userId = decoded.id;
        const query = 'SELECT id, username, email, role FROM users WHERE id=$1;';
        try {
            const users = await pool.query(query, [userId]);
            if(users.rowCount < 1) {
                req.user = {};
            } else {
                req.user = users.rows[0];
            }
        } catch(err) {
            return next(new AppError(err.message, 500))
        }
        next();

    })
}