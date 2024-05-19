const pool = require("../config/database");


exports.getProducts = async (req, res, next) => {
    const {
        query = '',
        category,
        priceMin,
        priceMax,
        page = 1,
        limit = 10
    } = req.query;

    let sqlQuery = `
        SELECT p.*, c.name AS category_name, ts_rank(p.search_vector, plainto_tsquery($1)) AS rank
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE plainto_tsquery($1) @@ p.search_vector
    `;
    let queryParams = [query];

    if (category) {
        sqlQuery += ` AND c.name = $${queryParams.length + 1}`;
        queryParams.push(category);
    }
    if (priceMin) {
        sqlQuery += ` AND p.price >= $${queryParams.length + 1}`;
        queryParams.push(priceMin);
    }
    if (priceMax) {
        sqlQuery += ` AND p.price <= $${queryParams.length + 1}`;
        queryParams.push(priceMax);
    }

    sqlQuery += `
        ORDER BY rank DESC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    queryParams.push(limit, (page - 1) * limit);

    console.log(sqlQuery)
    console.log(queryParams);
    try {
        const productsResult = await pool.query(sqlQuery, queryParams);
        if (productsResult.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Products Found!'
            });
        }
        const products = productsResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Products Retrieved',
            data: products
        });
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        });
    }
};


exports.getProductsBySearch = async (req, res, next) => {
    const {query} = req.query;
    const sqlQuery = `SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1`
    try {
        const productsResult = await pool.query(sqlQuery, [`%${query}%`]);
        if(productsResult.rowCount < 1) {
            return res.json({ message: 'No Results Matched!' });
        }
        const products = productsResult.rows
        return res.status(200).send({
            status: 'success',
            message: 'Products Retrieved',
            data: products
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}



exports.getProductCategories = async (req, res, next) => {
    const query = `SELECT * FROM categories;`;
    try {
        const categoriesResult = await pool.query(query);
        if(categoriesResult.rowCount < 1) {
            return req.status(404).send({
                status: 'fail',
                message: 'No Categories Found!'
            })
        }
        const categories = categoriesResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Categories Retrieved',
            data: categories
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}


exports.getProductById = async (req, res, next) => {
    const query = 'SELECT * FROM products WHERE id=$1;';
    try {
        const { id } = req.params;
        const product = await pool.query(query, [id]);
        if(product.rowCount < 1) {
            return res.status(404).send({
                status: 'fail',
                message: 'No Product Found!'
            })
        }
        return res.status(200).send({
            status: 'success',
            message: 'Product Retrieved',
            data: product.rows[0]
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

