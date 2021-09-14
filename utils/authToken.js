const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(req, res, next){
    const token = req.header('Authorization');

    if(!token) {
        res.status(401).json({
            status: false,
            errorMessage: 'Missing Token, Access Denied'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            status: false,
            errorMessage:'Invalid Token'
        });
    }
};
