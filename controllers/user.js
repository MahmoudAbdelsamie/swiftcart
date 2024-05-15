const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

require('dotenv').config();

const pool = require("../config/database");


exports.register = async (req, res, next) => {
    const {
        username,
        email,
        password
    } = req.body;
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;';
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await pool.query(query, [username, email, hashedPassword]);
        const id = user.rows[0];
        const token = jwt.sign(
            id,
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );
        return res.status(201).send({
            status: 'success',
            message: 'User Created Successfully...',
            token: token
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}