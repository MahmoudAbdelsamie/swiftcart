const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASS,
    host: process.env.DATABASE_HOST
});


module.exports = pool;