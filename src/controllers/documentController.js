const driveService =
require("../services/driveService");
const { Op } = require("sequelize");
const {
    User,
    Document
} = require("../models");

exports.uploadDocument =
async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400)
                .json({

                    success: false,

                    message:
                        "File required"

                });

        }

        const user =
            await User.findByPk(
                req.user.id
            );

        const uploadedFile =
            await driveService
            .uploadFile(

                req.file,

                user.folder_id

            );

        const document =
            await Document.create({

                user_id:
                    user.id,

                file_name:
                    uploadedFile.name,

                drive_file_id:
                    uploadedFile.id,

                web_view_link:
                    uploadedFile.webViewLink,

                visibility:
                    "Private"

            });

        return res.status(201)
            .json({

                success: true,

                data: document

            });

    } catch (error) {

        return res.status(500)
            .json({

                success: false,

                message:
                    error.message

            });

    }

};

exports.getMyDocuments =
async (req, res) => {

    try {

        const documents =
            await Document.findAll({

                where: {
                    user_id: req.user.id
                },

                order: [
                    ["createdAt", "DESC"]
                ]

            });

        return res.json({

            success: true,

            data: documents

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.shareDocument =
async (req, res) => {

    try {

        const { visibility } =
            req.body;

        const document =
            await Document.findByPk(
                req.params.id
            );

        if (!document) {

            return res.status(404)
                .json({

                    success: false,

                    message:
                        "Document not found"

                });

        }

        if (
            document.user_id !==
            req.user.id
        ) {

            return res.status(403)
                .json({

                    success: false,

                    message:
                        "Forbidden"

                });

        }

        await document.update({

            visibility

        });

        return res.json({

            success: true,

            message:
                "Visibility updated"

        });

    } catch (error) {

        return res.status(500)
            .json({

                success: false,

                message:
                    error.message

            });

    }

};

exports.sharedWithMe =
async (req, res) => {

    try {

        const user =
            await User.findByPk(
                req.user.id
            );

        const documents =
            await Document.findAll({

                include: [
                    {
                        model: User,
                        attributes: [
                            "id",
                            "name",
                            "role"
                        ]
                    }
                ],

                where: {

                    user_id: {
                        [Op.ne]:
                        req.user.id
                    },

                    [Op.or]: [

                        {
                            visibility:
                            "Public"
                        },

                        {
                            visibility:
                            "Role"
                        }

                    ]

                }

            });

        const filtered =
            documents.filter(doc => {

                if (
                    doc.visibility ===
                    "Public"
                ) {
                    return true;
                }

                return (
                    doc.user.role ===
                    user.role
                );

            });

        return res.json({

            success: true,

            data: filtered

        });

    } catch (error) {

        return res.status(500)
            .json({

                success: false,

                message:
                    error.message

            });

    }

};

exports.deleteDocument =
async (req, res) => {

    try {

        const document =
            await Document.findByPk(
                req.params.id
            );

        if (!document) {

            return res.status(404)
                .json({

                    success: false

                });

        }

        if (
            document.user_id !==
            req.user.id
        ) {

            return res.status(403)
                .json({

                    success: false

                });

        }

        await driveService
            .deleteFile(
                document.drive_file_id
            );

        await document.destroy();

        return res.json({

            success: true

        });

    } catch (error) {

        return res.status(500)
            .json({

                success: false,

                message:
                    error.message

            });

    }

};

exports.viewDocument = async (req, res) => {
    try {
        const document = await Document.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "role"]
                }
            ]
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // 1. Jika pemilik file
        if (document.user_id === req.user.id) {
            return res.json({
                success: true,
                data: {
                    id: document.id,
                    file_name: document.file_name,
                    web_view_link: document.web_view_link,
                    visibility: document.visibility
                }
            });
        }

        // Ambil user login
        const currentUser = await User.findByPk(req.user.id);

        // 2. Public
        if (document.visibility === "Public") {
            return res.json({
                success: true,
                data: {
                    id: document.id,
                    file_name: document.file_name,
                    web_view_link: document.web_view_link,
                    visibility: document.visibility
                }
            });
        }

        // 3. Role
        if (
            document.visibility === "Role" &&
            document.user.role === currentUser.role
        ) {
            return res.json({
                success: true,
                data: {
                    id: document.id,
                    file_name: document.file_name,
                    web_view_link: document.web_view_link,
                    visibility: document.visibility
                }
            });
        }

        return res.status(403).json({
            success: false,
            message: "You do not have access to this document"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.renameDocument = async (req, res) => {
    try {
        const { file_name } = req.body;

        const document = await Document.findByPk(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        if (document.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        await driveService.renameFile(
            document.drive_file_id,
            file_name
        );

        await document.update({
            file_name
        });

        return res.json({
            success: true,
            message: "Document renamed successfully",
            data: document
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};