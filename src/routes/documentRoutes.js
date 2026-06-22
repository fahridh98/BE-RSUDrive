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

router.get(
    "/shared-with-me",
    authMiddleware,
    documentController.sharedWithMe
);

router.delete(
    "/:id",
    authMiddleware,
    documentController.deleteDocument
);

router.get(
    "/:id/view",
    authMiddleware,
    documentController.viewDocument
);

router.put(
    "/:id/rename",
    authMiddleware,
    documentController.renameDocument
);

module.exports = router;