const router = require("express").Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const roleMiddleware =
require("../middlewares/roleMiddleware");

const userController =
require("../controllers/userController");

router.use(authMiddleware);

router.use(roleMiddleware(["IT"]));

router.post(
    "/",
    userController.createUser
);

router.get(
    "/",
    userController.getUsers
);

router.get(
    "/:id",
    userController.getUserById
);

router.put(
    "/:id",
    userController.updateUser
);

router.put(
    "/:id/reset-password",
    userController.resetPassword
);

router.put(
    "/:id/deactivate",
    userController.deactivateUser
);

module.exports = router;