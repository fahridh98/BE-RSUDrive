exports.successResponse = (
    res,
    message = "Success",
    data = null,
    statusCode = 200,
    extra = {}
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...extra
    });
};

exports.errorResponse = (
    res,
    message = "Internal Server Error",
    statusCode = 500,
    errors = null
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors ? { errors } : {})
    });
};