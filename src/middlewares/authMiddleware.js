const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new AppError("Token required", 401));
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(new AppError("Invalid token format", 401));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        next(error);
    }
};