const multer = require("multer");
const path = require("path");

const allowedExtensions = [

    ".pdf",

    ".doc",
    ".docx",

    ".xls",
    ".xlsx",

    ".ppt",
    ".pptx",

    ".txt"

];

const storage = multer.memoryStorage();

const fileFilter = (
    req,
    file,
    cb
) => {

    const ext =
        path.extname(
            file.originalname
        ).toLowerCase();

    if (
        !allowedExtensions.includes(ext)
    ) {

        return cb(
            new Error(
                "Only document files allowed"
            )
        );

    }

    cb(null, true);
};

module.exports = multer({

    storage,

    fileFilter,

    limits: {
        fileSize:
            20 * 1024 * 1024
    }

});