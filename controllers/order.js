const pool = require("../config/database");
const { getOrCreateCart } = require("../utils/cart");
const { NotFoundError, AppError } = require("../utils/errors");


exports.createOrder = async (req, res, next) => {
    const {
        shippingAddress,
        paymentMethod,
    } = req.body;
    const user_id = req.user.id;
    const cartId = await getOrCreateCart(user_id);
    try {
        const getCartItemsQuery = `
            SELECT
                ci.product_id,
                ci.quantity,
                p.price
            FROM
                cart_items ci
            JOIN
                products p ON ci.product_id = p.id
            WHERE 
                ci.cart_id = $1;
        `;
        const addShippingAddressQuery = `
            INSERT INTO addresses (user_id, street, city, state, zip, country)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        const addOrderQuery = `
            INSERT INTO orders (user_id, total, status, shipping_address_id, payment_method)
            VALUES ($1, $2, 'Proccessing', $3, $4)
            RETURNING id
        `;
        const addOrderItemsQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4);
        `;
        const deleteCartItemsQuery = `
            DELETE FROM cart_items WHERE cart_id = $1;
        `;

        const cartItemsResult = await pool.query(getCartItemsQuery, [cartId]);
        if(cartItemsResult.rowCount < 1) {
            return next(new NotFoundError('No Cart Items Found'))
        }

        const totalAmount = cartItemsResult.rows.reduce((sum, item) => sum + item.price*item.quantity, 0);
        const shippingAddressResult = await pool.query(addShippingAddressQuery, [
            user_id,
            shippingAddress.street,
            shippingAddress.city,
            shippingAddress.state,
            shippingAddress.zip,
            shippingAddress.country
        ]);
        const shippingAddressId = shippingAddressResult.rows[0].id;

        const orderResult = await pool.query(addOrderQuery, [
            user_id,
            totalAmount,
            shippingAddressId,
            paymentMethod
        ]);
        const orderId = orderResult.rows[0].id;
        const insertOrderItemsPromises = cartItemsResult.rows.map(item => {
            return pool.query(addOrderItemsQuery, [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ])
        });
        await Promise.all(insertOrderItemsPromises);
        await pool.query(deleteCartItemsQuery, [cartId]);
        return res.status(201).send({
            status: 'success',
            message: 'Order Created',
            orderId: orderId
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}


exports.getOrderDetails = async (req, res, next) => {
    const { id } = req.params;
    const orderQuery = `
    SELECT 
        o.id,
        o.user_id,
        o.total,
        o.payment_method,
        a.street,
        a.city,
        a.state,
        a.zip,
        a.country
    FROM
        orders o
    JOIN
        addresses a ON o.shipping_address_id = a.id
    WHERE
        o.id = $1;
    `;
    const orderItemsQuery = `
        SELECT 
            oi.product_id,
            p.name AS product_name,
            oi.quantity,
            oi.price
        FROM
            order_items oi
        JOIN
            products p ON oi.product_id = p.id
        WHERE 
            oi.order_id = $1;
    `;
    try {
        const orderResult = await pool.query(orderQuery, [id]);
        if(orderResult.rowCount < 1) {
            return next(new NotFoundError('No Order Found'))
        }
        const order = orderResult.rows[0];
        const orderItemsResult = await pool.query(orderItemsQuery ,[id]);
        const orderItems = orderItemsResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Order & Items Retrieved',
            order: order,
            items: orderItems
        })
        
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}

exports.getUserOrders = async (req, res, next) => {
    const userId = req.user.id;
    const ordersQuery = `
        SELECT
            o.id AS order_id,
            o.total,
            o.status,
            o.payment_method,
            a.street,
            a.city,
            a.state,
            a.zip,
            a.country
        FROM
            orders o
        JOIN
            addresses a ON o.shipping_address_id = a.id
        WHERE
            o.user_id = $1;
    `;
    const orderItemsQuery = `
        SELECT
            oi.product_id,
            p.name AS product_name,
            oi.quantity,
            oi.price
        FROM
            order_items oi
        JOIN
            products p ON oi.product_id = p.id
        WHERE
            oi.order_id = $1;
    `;
    try {
        const ordersResult = await pool.query(ordersQuery, [userId]);
        if(ordersResult.rowCount < 1) {
            return next(new NotFoundError('No Orders Found'));
        }
        const orders = ordersResult.rows;

        const orderDetailsPromises = orders.map(async (order) => {
            const orderItemsResult = await pool.query(orderItemsQuery, [order.order_id]);
            return {
                ...order,
                items: orderItemsResult.rows
            };
        });
        const detailedOrders = await Promise.all(orderDetailsPromises);
        return res.status(200).send({
            status: 'success',
            message: 'User Orders Retrieved',
            data: detailedOrders
        })

    } catch(err) {
        return next(new AppError(err.message, 500))
    }


}

exports.getOrderConfirm = async (req, res, next) => {
    const userId = req.user.id;
    const { orderId } = req.params;
    const query = `
    SELECT o.id, o.user_id, o.total, o.status, o.created_at,
        u.username, u.email,
        json_agg(json_build_object('product_id', p.id, 'name', p.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = $1 AND o.user_id = $2
    GROUP BY o.id, u.username, u.email
    `;
    try {
        const orderResult = await pool.query(query, [orderId, userId]);
        if(orderResult.rowCount < 1) {
            return next(new NotFoundError('No Order Found'))
        }
        const order = orderResult.rows[0];
        return res.status(200).send({
            status: 'success',
            message: 'Order Retrieved',
            data: order
        })

    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}

exports.getOrderTrack = async (req, res, next) => {
    const userId = req.user.id;
    const { orderId } = req.params;
    const query = `
        SELECT o.id, o.status, o.created_at,
            json_agg(json_build_object('product_id', p.id, 'name', p.name, 'quantity', oi.quantity, 'price', oi.price)) AS items
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.id = $1 AND o.user_id = $2
        GROUP BY o.id
    `;
    try {
        const orderResult = await pool.query(query, [userId, orderId]);
        if(orderResult.rowCount < 1) {
            return next(new NotFoundError('No Order Found'))
        }
        const order = orderResult.rows[0];
        return res.status(200).send({
            status: 'success',
            message: 'Order Tracking Retrieved',
            data: order
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}


exports.getOrdersHistory = async (req, res, next) => {
    const userId = req.user.id;
    const query = `
        SELECT 
            o.id AS order_id,
            o.total,
            o.status,
            o.created_at,
            a.street,
            a.city,
            a.state,
            a.zip,
            a.country,
            ARRAY_AGG(
                JSON_BUILD_OBJECT(
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'quantity', oi.quantity,
                    'price', oi.price
                )
            ) AS items
        FROM orders o
        JOIN addresses a ON o.shipping_address_id = a.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id, a.street, a.city, a.state, a.zip, a.country
        ORDER BY o.created_at DESC;
    `;
    try {
        const ordersResult = await pool.query(query, [userId]);
        if(ordersResult.rowCount < 1) {
            return next(new NotFoundError('No Order History Found'))
        }
        const orderHistory = ordersResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Order History Retrieved',
            data: orderHistory
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}


