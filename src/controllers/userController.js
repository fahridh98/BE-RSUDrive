const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.createUser = async (req, res) => {

    try {

        const {
            name,
            password,
            role
        } = req.body;

        const exist = await User.findOne({
            where: { name }
        });

        if (exist) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            password: hashedPassword,

            role

        });

        return res.status(201).json({

            success: true,

            data: {
                id: user.id,
                name: user.name,
                role: user.role
            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

exports.getUsers = async (req, res) => {

    try {

        const users = await User.findAll({

            attributes: {
                exclude: ["password"]
            }

        });

        return res.json({
            success: true,
            data: users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getUserById = async (req, res) => {

    try {

        const user =
            await User.findByPk(
                req.params.id,
                {
                    attributes: {
                        exclude: ["password"]
                    }
                }
            );

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

exports.updateUser = async (req, res) => {

    try {

        const user =
            await User.findByPk(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const {
            name,
            role,
            is_active
        } = req.body;

        await user.update({

            name,
            role,
            is_active

        });

        return res.json({

            success: true,
            message: "User updated"

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

exports.resetPassword = async (req, res) => {

    try {

        const {
            password
        } = req.body;

        const user =
            await User.findByPk(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await user.update({
            password: hashedPassword
        });

        return res.json({

            success: true,
            message: "Password reset"

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

exports.deactivateUser = async (req, res) => {

    try {

        const user =
            await User.findByPk(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        await user.update({
            is_active: false
        });

        return res.json({

            success: true,
            message: "User deactivated"

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};