module.exports = (allowedRoles = []) => {

    return (req, res, next) => {

        try {

            if (!allowedRoles.includes(req.user.role)) {

                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });

            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

};

const AppError = require("../utils/appError");

module.exports = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            if (!allowedRoles.includes(req.user.role)) {
                return next(new AppError("Access denied", 403));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};