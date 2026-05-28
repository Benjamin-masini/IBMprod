const express = require("express");

const router = express.Router();

const controller = require(
  "./notification.controller.js"
);

const auth = require(
  "../../middleware/auth.middleware.js"
);

// GET USER NOTIFICATIONS
router.get(
  "/",
  auth,
  controller.getNotifications
);

// MARK AS READ
router.patch(
  "/:id/read",
  auth,
  controller.markAsRead
);

// DELETE
router.delete(
  "/:id",
  auth,
  controller.deleteNotification
);

module.exports = router;
