const drive = require(
    "../config/googleDrive"
);

exports.testDrive = async () => {

    const response =
        await drive.files.list({
            pageSize: 10
        });

    return response.data.files;
};