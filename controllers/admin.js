// GET /api/admin/users

const pool = require("../config/database");

// return users & their addresses
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
        if(users.rowCount < 1) {
            return res.json({message: 'No Users Founded!'});
        }
        return res.status(200).send({
            status: 'success',
            message: 'Users Retrieved',
            data: users.rows
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
            error: err.message 
        })
    }
}