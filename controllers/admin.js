const pool = require("../config/database");

// get users & their addresses
exports.getUsers = async (req, res, next) => {
  const query = `
        SELECT
	        u.username AS username,
            u.email AS email,
            u.role as role,
            u.created_at AS sign_in_date,
            ad.street AS street,
            ad.city AS city ,
            ad.state AS state,
            ad.zip AS zip_code,
            ad.country AS country
        FROM users u
        JOIN addresses ad ON u.id = ad.user_id; 
    `;
  try {
    const users = await pool.query(query);
    if (users.rowCount < 1) {
      return res.json({
        message: "No Users Found!",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Users Retrieved",
      data: users.rows,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// get specific user & address by id
exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const query = `
    SELECT
        u.username AS username,
        u.email AS email,
        u.role as role,
        u.created_at AS sign_in_date,
        ad.street AS street,
        ad.city AS city ,
        ad.state AS state,
        ad.zip AS zip_code,
        ad.country AS country
    FROM users u
    JOIN addresses ad ON u.id = ad.user_id
    WHERE u.id = $1;
    `;
  try {
    const user = await pool.query(query, [userId]);
    if (user.rowCount < 1) {
      return res.json({
        message: "No User Found",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "User Retrieved",
      data: user.rows[0],
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.deleteUserById = async (req, res, next) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = $1;";
  const getUserQuery = "SELECT * FROM users WHERE id = $1;";
  try {
    const { rows } = await pool.query(getUserQuery, [userId]);
    if (rows.length < 1) {
      return res.json({
        message: "No User Found",
      });
    }
    await pool.query(query, [userId]);
    return res.status(200).send({
      status: "success",
      message: "User Deleted",
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.addProduct = async (req, res, next) => {

    const {
        name,
        description,
        price,
        stock,
        category_id
    } = req.body;
    const query = `
        INSERT INTO products (name, description, price, stock, category_id, image)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, description, price, stock, category_id, image;
    `;
    try {
        const imageBase64 = req.file.buffer.toString("base64");
        const productResult = await pool.query(query, [name, description, price, stock, category_id, imageBase64]);
        const newProduct = productResult.rows[0];
        return res.status(201).send({
            status: 'success',
            message: 'Product Added',
            data: newProduct
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message : 'Internal Server Error',
            error: err.message
        })
    }
};


exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    stock,
    category_id
  } = req.body;
  try {
    let query = `UPDATE products SET `;
    const values = [];
    let index = 1;
    if(name) {
      query += `name = $${index++}, `;
      values.push(name);
    }
    if(description) {
      query += `description = $${index++}, `;
      values.push(description);
    }
    if(price) {
      query += `price = $${index++}, `;
      values.push(price);
    }
    if(stock) {
      query += `stock = $${index++}, `;
      values.push(stock);
    }
    if(category_id) {
      query += `category_id = $${index++}, `;
      values.push(category_id)
    }
    if(req.file) {
      const imageBase64 = req.file.buffer.toString('base64');
      query += `image = $${index++}, `;
      values.push(imageBase64);
    }
    query = query.slice(0, -2) + ` WHERE id = $${index} RETURNING id, name, description, price, stock, category_id, image`;
    values.push(id);
    const productResult = await pool.query(query, values);
    if(productResult.rowCount < 1) {
      return res.status(404).send({
        status: 'fail',
        message: 'Product Not Found'
      })
    }
    const updatedProduct = productResult.rows[0];
    return res.status(200).send({
      status: 'success',
      message: 'Product Updated',
      data: updatedProduct
    })
  } catch(err) {
    return res.status(500).send({
        status: 'error',
        message : 'Internal Server Error',
        error: err.message
    })
  }
}


exports.deleteProductById = async (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM products WHERE id = $1;`;
  try {
    await pool.query(query, [id]);
    return res.status(200).send({
      status: 'success',
      message: 'Product Deleted'
    })
  } catch(err) {
    return res.status(500).send({
        status: 'error',
        message : 'Internal Server Error',
        error: err.message
    })
  }
}
















