const pool = require('../config/database');
const { NotFoundError, AppError } = require('../utils/errors');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res, next) => {
    const {orderId} = req.body;
    const query = `SELECT total FROM orders WHERE id = $1;`;
    try {
        const orderResult = await pool.query(query, [orderId]);
        if(orderResult.rowCount < 1) {
            return next(new NotFoundError('No Order Found'))
        }
        const orderTotal = orderResult.rows[0].total;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(orderTotal * 100),
            currency: 'usd',
            metadata: { orderId },
            // paymentMethod: paymentMethodId  // Must Provide a Payment Method By Client-Side
        })
        return res.status(200).send({
            status: 'success',
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }

}


exports.confirmPayment = async (req, res, next) => {
    const { orderId } = req.params;
    const { paymentIntentId } = req.body;
    const query = `UPDATE orders SET status = $1 WHERE id = $2`
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // console.log(paymentIntent.status)
        if(paymentIntent.status == 'succeeded') {
            await pool.query(query, ['Paid', orderId]);
            return res.status(200).send({
                status: 'success',
                message: 'Payment Successful'
            })
        } else {
            return res.status(400).send({
                status: 'fail',
                message: 'Payment not Successful.'
            })
        }
    } catch(err) {
        return next(new AppError(err.message, 500))
    }

}


