

exports.isAdmin = async (req, res, next) => {
    if( req.user && req.user.role === 'admin' ) {
        next();
    } else {
        return res.status(403).send({
            status: 'fail',
            message: 'Unauthorized Access'
        })
    }
}