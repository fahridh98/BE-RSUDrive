const bcrypt = require("bcrypt");
const { User } = require("../models");
const driveService = require("../services/driveService");

const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

exports.createUser = async (req, res, next) => {
  try {
    const { name, password, role } = req.body;

    const exist = await User.findOne({
      where: { name },
    });

    if (exist) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
      role,
    });

    const folderId = await driveService.createUserFolder(
      user.id,
      user.name,
      user.role
    );

    await user.update({
      folder_id: folderId,
    });

    return successResponse(
      res,
      "User created successfully",
      {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    return successResponse(
      res,
      "Users fetched successfully",
      users,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return successResponse(
      res,
      "User fetched successfully",
      user,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { name, role, is_active } = req.body;

    await user.update({
      name,
      role,
      is_active,
    });

    return successResponse(
      res,
      "User updated successfully",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
    });

    return successResponse(
      res,
      "Password reset successfully",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    await user.update({
      is_active: false,
    });

    return successResponse(
      res,
      "User deactivated successfully",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};