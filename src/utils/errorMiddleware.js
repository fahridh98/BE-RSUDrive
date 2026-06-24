const { errorResponse } = require("../utils/response");

module.exports = (err, req, res, next) => {
    console.error("ERROR:", err);

    // Multer file validation
    if (err.message === "Only document files allowed") {
        return errorResponse(
            res,
            "Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT files are allowed",
            400
        );
    }

    // Sequelize validation
    if (err.name === "SequelizeValidationError") {
        return errorResponse(
            res,
            "Validation error",
            400,
            err.errors.map(e => e.message)
        );
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        return errorResponse(res, "Invalid token", 401);
    }

    if (err.name === "TokenExpiredError") {
        return errorResponse(res, "Token expired", 401);
    }

    // Custom AppError
    if (err.isOperational) {
        return errorResponse(
            res,
            err.message,
            err.statusCode
        );
    }

    return errorResponse(
        res,
        err.message || "Internal Server Error",
        500
    );
};