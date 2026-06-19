const driveService =
require("../services/driveService");

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