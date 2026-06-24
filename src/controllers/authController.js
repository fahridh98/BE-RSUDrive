const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

exports.login = async (req, res, next) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne({
            where: { name }
        });

        if (!user) {
            return next(new AppError("User not found", 401));
        }

        if (!user.is_active) {
            return next(new AppError("User is inactive", 403));
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return next(new AppError("Wrong password", 401));
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return successResponse(
            res,
            "Login successful",
            { token },
            200
        );

    } catch (error) {
        next(error);
    }
};

exports.me = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ["password"]
            }
        });

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        return successResponse(
            res,
            "Profile fetched successfully",
            user
        );

    } catch (error) {
        next(error);
    }
};