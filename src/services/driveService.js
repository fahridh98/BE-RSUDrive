const { Readable } = require("stream");
const drive = require(
    "../config/googleDrive"
);

exports.findFolderByName = async (
    folderName,
    parentId
) => {

    const response =
        await drive.files.list({

            q: `
            mimeType='application/vnd.google-apps.folder'
            and name='${folderName}'
            and '${parentId}' in parents
            and trashed=false
            `,

            fields: "files(id,name)"
        });

    return response.data.files[0];
};

exports.createFolder = async (
    folderName,
    parentId
) => {

    const response =
        await drive.files.create({

            requestBody: {

                name: folderName,

                mimeType:
                    "application/vnd.google-apps.folder",

                parents: [parentId]

            },

            fields: "id,name"
        });

    return response.data;
};

exports.getOrCreateFolder = async (
    folderName,
    parentId
) => {

    const existing =
        await this.findFolderByName(
            folderName,
            parentId
        );

    if (existing) {
        return existing;
    }

    return await this.createFolder(
        folderName,
        parentId
    );
};

exports.createUserFolder =
async (
    userId,
    userName,
    role
) => {

    const rootId =
        process.env.GOOGLE_ROOT_FOLDER_ID;

    const roleFolder =
        await exports.getOrCreateFolder(
            role,
            rootId
        );

    const userFolder =
        await exports.createFolder(
            `${userId}_${userName}`,
            roleFolder.id
        );

    return userFolder.id;
};

exports.uploadFile =
async (
    file,
    folderId
) => {

    const bufferStream =
        new Readable();

    bufferStream.push(
        file.buffer
    );

    bufferStream.push(null);

    const response =
        await drive.files.create({

            requestBody: {

                name:
                    file.originalname,

                parents: [
                    folderId
                ]

            },

            media: {

                mimeType:
                    file.mimetype,

                body:
                    bufferStream

            },

            fields:
                "id,name,webViewLink"

        });

    return response.data;
};

exports.deleteFile =
async (fileId) => {

    await drive.files.delete({

        fileId

    });

};

exports.renameFile = async (fileId, newName) => {
    const response = await drive.files.update({
        fileId,
        requestBody: {
            name: newName
        },
        fields: "id,name"
    });

    return response.data;
};