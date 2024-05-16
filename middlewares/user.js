const jwt = require("jsonwebtoken");
const pool = require("../config/database");
require('dotenv').config();

exports.isAuthorized = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send({
            status: 'fail',
            message: 'Unauthorized'
        });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if(err) {
            return res.status(401).send({
                status: 'fail',
                message: 'Unauthorized',
                error: err.message
            })
        }
        const userId = decoded.id;
        const query = 'SELECT id, username, email FROM users WHERE id=$1;';
        try {
            const users = await pool.query(query, [userId]);
            if(users.rowCount < 1) {
                req.user = {};
            } else {
                req.user = users.rows[0];
            }
        } catch(err) {
            return res.status(500).send({
                status: 'error',
                message: 'Internal Server Error',
                error: err.message
            })
        }
        next();

    })
}