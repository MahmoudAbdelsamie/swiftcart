const pool = require("../config/database");
const { NotFoundError, AppError } = require("../utils/errors");


exports.getProducts = async (req, res, next) => {
    const {
        category,
        priceMin,
        priceMax,
        sort = 'created_at', 
        page = 1,
        limit = 10
    } = req.query;

    let sqlQuery = `
        SELECT p.*, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE 1=1
    `;
    let countQuery = `
        SELECT COUNT(*) AS total
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE 1=1
    `;
    let queryParams = [];
    let countParams = [];

    if (category) {
        sqlQuery += ` AND c.name = $${queryParams.length + 1}`;
        countQuery += ` AND c.name = $${countParams.length + 1}`;
        queryParams.push(category);
        countParams.push(category);
    }
    if (priceMin) {
        sqlQuery += ` AND p.price >= $${queryParams.length + 1}`;
        countQuery += ` AND p.price >= $${countParams.length + 1}`;
        queryParams.push(priceMin);
        countParams.push(priceMin);
    }
    if (priceMax) {
        sqlQuery += ` AND p.price <= $${queryParams.length + 1}`;
        countQuery += ` AND p.price <= $${countParams.length + 1}`;
        queryParams.push(priceMax);
        countParams.push(priceMax);
    }

    sqlQuery += ` ORDER BY p.${sort}`;
    
    sqlQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    try {
        const productsResult = await pool.query(sqlQuery, queryParams);
        const countResult = await pool.query(countQuery, countParams);
        const totalProducts = countResult.rows[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        const products = productsResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Products Retrieved',
            data: {
                products,
                pagination: {
                    totalProducts,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (err) {
        console.error('Error executing query:', err.message);
        return next(new AppError(err.message, 500));
    }
};




exports.getProductsBySearch = async (req, res, next) => {
    const {query} = req.query;
    const sqlQuery = `SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1`
    try {
        const productsResult = await pool.query(sqlQuery, [`%${query}%`]);
        if(productsResult.rowCount < 1) {
            return next(new NotFoundError('No Products Match'))
        }
        const products = productsResult.rows
        return res.status(200).send({
            status: 'success',
            message: 'Products Retrieved',
            data: products
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}



exports.getProductCategories = async (req, res, next) => {
    const query = `SELECT * FROM categories;`;
    try {
        const categoriesResult = await pool.query(query);
        if(categoriesResult.rowCount < 1) {
            return next(new NotFoundError('No Categories Found'))
        }
        const categories = categoriesResult.rows;
        return res.status(200).send({
            status: 'success',
            message: 'Categories Retrieved',
            data: categories
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}


exports.getProductById = async (req, res, next) => {
    const query = 'SELECT * FROM products WHERE id=$1;';
    try {
        const { id } = req.params;
        const product = await pool.query(query, [id]);
        if(product.rowCount < 1) {
            return next(new NotFoundError('No Product Found'))
        }
        return res.status(200).send({
            status: 'success',
            message: 'Product Retrieved',
            data: product.rows[0]
        })
    } catch(err) {
        return next(new AppError(err.message, 500))
    }
}

