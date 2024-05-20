const { UnauthorizedError } = require("../utils/errors");


exports.isAdmin = async (req, res, next) => {
    if( req.user && req.user.role === 'admin' ) {
        next();
    } else {
        return next(new UnauthorizedError('This Resource is Only For Admins'))
    }
}