const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


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
            message: 'User Created',
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

exports.login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const query = 'SELECT * FROM users WHERE email=$1;';
    try {
        const users = await pool.query(query, [email]);
        if(users.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No User Found'
            })
        }
        const user = users.rows[0];
        const hashedPassword = user.password;
        const isPasswordMatch = bcrypt.compare(password, hashedPassword);
        if(!isPasswordMatch) {
            return res.status(401).send({
                status: 'fail',
                message: 'Invalid Email Or Password'
            })
        }
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(200).send({
            status: 'success',
            message: 'Login Success',
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


exports.getUserProfile = async (req, res, next) => {
    try {
        return res.status(200).send({
            status: 'success',
            message: 'User Profile Retrieved',
            data: req.user
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
};


exports.updateUserProfile = async (req, res, next) => {
    const userId = req.user.id;
    const {
        username,
        email
    } = req.body;
    let query = `UPDATE users SET `;
    try {
        const values = [];
        if(username) {
            values.push(username);
            query += `username = $${values.length} `;
        }
        if(email) {
            if(values.length) { query += `, `; }
            values.push(email); 
            query += `email = $${values.length} `;
        }
        values.push(userId);
        query += `WHERE id = $${values.length} RETURNING id, username, email, role;`;
        
        const userResult = await pool.query(query, values);
        const updatedUser = userResult.rows[0];
        return res.status(200).send({
            status: 'success',
            message: 'User Updated',
            data: updatedUser
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

exports.updatePassword = async (req, res, next) => {
    const id = req.user.id;
    const {
        oldPassword,
        newPassword
    } = req.body;
    const getPasswordQuery = `SELECT password FROM users WHERE id = $1;`;
    const updatePasswordQuery = `UPDATE users SET password = $1 WHERE id = $2;`;
    try {
        const userResult = await pool.query(getPasswordQuery, [id]);
        if(userResult.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'User Not Found'
            })
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch) {
            return res.status(400).send({
                status: 'fail',
                message: 'Old Password Is Incorrect!'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await pool.query(updatePasswordQuery, [hashedPassword, id]);
        return res.status(200).send({
            status: 'success',
            message: 'Password Updated',
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}


exports.forgetPasswordRequest = async (req, res, next) => {
    const { email } = req.body;
    const getUserQuery = 'SELECT * FROM users WHERE email = $1;';
    const addResetTokenQuery = 'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3;';
    try {
        const userResult = await pool.query(getUserQuery, [email]);
        if(userResult.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No User Found!'
            })
        }
        const user = userResult.rows[0];

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + (60*60*1000));
        
        await pool.query(addResetTokenQuery, [token, tokenExpires, user.id]);
        // makes an error using .env so replace with email & app password direct
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_APP_PASS,
            }
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password:\n\nhttp://localhost:5000/api/v1/user/reset-password?token=${token}\n\nThis link will expire in 1 hour.`,
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).send({
            status: 'success',
            message: 'Password Reset Email Sent'
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
};


exports.verifyForgetPassword = async (req, res, next) => {
    const {
        token,
        newPassword
    } = req.body;
    const getUserQuery = `SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW();`;
    const updatePasswordQuery = `UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2;`;
    try {
        const userResult = await pool.query(getUserQuery, [token]);
        if(userResult.rowCount < 1) {
            return res.status(400).send({
                status: 'fail',
                message: 'Invalid Or Expires Token'
            });
        }
        const user = userResult.rows[0];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await pool.query(updatePasswordQuery, [hashedPassword, user.id]);
        return res.status(200).send({
            status: 'success',
            message: 'Password Reset'
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}
