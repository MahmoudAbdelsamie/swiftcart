const pool = require("../config/database");
const { getOrCreateCart } = require("../utils/cart");

exports.addToCart = async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.body.productId;
  const quantity = req.body.quantity || 1;
  const getProductQuery =
    "SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2;";
  const updateQuantityQuery =
    "UPDATE cart_items SET quantity = $1 WHERE id = $2;";
  const addProductQuery =
    "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3);";
  try {
    const cartId = await getOrCreateCart(userId);
    const cartItem = await pool.query(getProductQuery, [cartId, productId]);
    if (cartItem.rowCount < 1) {
      await pool.query(addProductQuery, [cartId, productId, quantity]);
    } else {
      const newQuantity = quantity;
      await pool.query(updateQuantityQuery, [newQuantity, cartItem.rows[0].id]);
    }
    return res.status(201).send({
      status: "success",
      message: "Product Added To Cart",
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getCart = async (req, res, next) => {
  const userId = req.user.id;
  const cartId = await getOrCreateCart(userId);
  const cartItemsQuery = `
    SELECT 
	    ci.cart_id,
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        ci.quantity,
        (p.price * ci.quantity) AS total_price
    FROM
	    cart_items ci
    JOIN
	    products p ON ci.product_id = p.id
    WHERE 
	    ci.cart_id = $1;
    `;
  const cartPriceQuery = `
    SELECT
	    SUM(p.price * ci.quantity) AS total_cart_price
    FROM
	    cart_items ci 
    JOIN 
	    products p ON ci.product_id = p.id 
    WHERE 
	    ci.cart_id = $1;
  `;

  try {
    const cartItems = await pool.query(cartItemsQuery, [cartId]);
    const totalCartPrice = await pool.query(cartPriceQuery, [cartId]);
    return res.status(200).send({
        status: 'success',
        message: 'Cart Item Retrieved',
        data: cartItems.rows,
        total: totalCartPrice.rows[0].total_cart_price
    })
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
