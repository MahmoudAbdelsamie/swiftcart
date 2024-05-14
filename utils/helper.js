const pool = require("../config/database")

exports.testDBConnection = () => {
    return pool.query('SELECT NOW();');
}