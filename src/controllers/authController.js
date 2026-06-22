const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.login = async (req, res) => {

    try {

        const { name, password } = req.body;

        const user = await User.findOne({
            where: { name }
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "User is inactive"
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {
            return res.status(401).json({
                message: "Wrong password"
            });
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

        res.json({
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ["password"]
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};