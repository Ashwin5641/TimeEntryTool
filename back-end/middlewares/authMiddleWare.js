const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
        return res.status(401).json({
            success: false,
            message: 'No token'
        })
    }

    const token = authHeaders.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("Access token expired, requesting refresh...");
                return res.status(401).json({
                    message: 'Access Token Expired'
                })
            }

            console.error(err);

            return res.status(403).json({
                message: "Invalid token"
            });
        }

        req.user = user;

        next()
    })
}

exports.isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access Denied'
        })
    }

    next();
}