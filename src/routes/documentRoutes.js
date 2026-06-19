const router =
require("express").Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const upload =
require("../middlewares/uploadMiddleware");

const documentController =
require("../controllers/documentController");

router.post(

    "/upload",

    authMiddleware,

    upload.single("file"),

    documentController.uploadDocument

);

router.get(
    "/my-documents",
    authMiddleware,
    documentController.getMyDocuments
);

router.put(
    "/:id/share",
    authMiddleware,
    documentController.shareDocument
);

module.exports = router;