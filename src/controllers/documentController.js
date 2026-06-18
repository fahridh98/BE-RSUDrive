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