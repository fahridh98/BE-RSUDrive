const { Op } = require("sequelize");
const { User, Document } = require("../models");
const driveService = require("../services/driveService");

const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("File required", 400));
    }

    const user = await User.findByPk(req.user.id);

    const uploadedFile = await driveService.uploadFile(
      req.file,
      user.folder_id
    );

    const document = await Document.create({
      user_id: user.id,
      file_name: uploadedFile.name,
      drive_file_id: uploadedFile.id,
      web_view_link: uploadedFile.webViewLink,
      visibility: "Private",
    });

    return successResponse(
      res,
      "Document uploaded successfully",
      document,
      201
    );
  } catch (error) {
    next(error);
  }
};

exports.getMyDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const { count, rows } = await Document.findAndCountAll({
      where: {
        user_id: req.user.id,
        file_name: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const responseData = {
      documents: rows,
      pagination: {
        total_data: count,
        current_page: page,
        per_page: limit,
        total_page: Math.ceil(count / limit),
      },
    };

    return successResponse(
      res,
      "My documents fetched successfully",
      responseData,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.shareDocument = async (req, res, next) => {
  try {
    const { visibility } = req.body;

    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError("Document not found", 404));
    }

    if (document.user_id !== req.user.id) {
      return next(new AppError("Forbidden: You do not own this document", 403));
    }

    await document.update({
      visibility,
    });

    return successResponse(
      res,
      "Visibility updated successfully",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.sharedWithMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    const documents = await Document.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "role"],
        },
      ],
      where: {
        user_id: {
          [Op.ne]: req.user.id,
        },
        [Op.or]: [
          {
            visibility: "Public",
          },
          {
            visibility: "Role",
          },
        ],
      },
    });

    const filtered = documents.filter((doc) => {
      if (doc.visibility === "Public") {
        return true;
      }
      return doc.user.role === user.role;
    });

    return successResponse(
      res,
      "Shared documents fetched successfully",
      filtered,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError("Document not found", 404));
    }

    if (document.user_id !== req.user.id) {
      return next(new AppError("Forbidden: You do not own this document", 403));
    }

    await driveService.deleteFile(document.drive_file_id);

    await document.destroy();

    return successResponse(
      res,
      "Document deleted successfully",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};

exports.viewDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "role"],
        },
      ],
    });

    if (!document) {
      return next(new AppError("Document not found", 404));
    }

    const responseData = {
      id: document.id,
      file_name: document.file_name,
      web_view_link: document.web_view_link,
      visibility: document.visibility,
    };

    if (document.user_id === req.user.id) {
      return successResponse(res, "Document accessed", responseData, 200);
    }

    const currentUser = await User.findByPk(req.user.id);

    if (document.visibility === "Public") {
      return successResponse(res, "Document accessed", responseData, 200);
    }

    if (
      document.visibility === "Role" &&
      document.user.role === currentUser.role
    ) {
      return successResponse(res, "Document accessed", responseData, 200);
    }

    return next(new AppError("You do not have access to this document", 403));
  } catch (error) {
    next(error);
  }
};

exports.renameDocument = async (req, res, next) => {
  try {
    const { file_name } = req.body;

    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return next(new AppError("Document not found", 404));
    }

    if (document.user_id !== req.user.id) {
      return next(new AppError("Forbidden: You do not own this document", 403));
    }

    await driveService.renameFile(document.drive_file_id, file_name);

    await document.update({
      file_name,
    });

    return successResponse(
      res,
      "Document renamed successfully",
      document,
      200
    );
  } catch (error) {
    next(error);
  }
};