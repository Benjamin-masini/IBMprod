const express = require("express");

const router = express.Router();

const controller = require(
  "./messaging.controller.js"
);

const auth = require(
  "../../middleware/auth.middleware.js"
);

const upload = require(
  "../../middleware/chatUpload.middleware.js"
);

// CREATE CONVERSATION
router.post(
  "/conversation",
  auth,
  controller.createConversation
);

// GET USER CONVERSATIONS
router.get(
  "/conversation",
  auth,
  controller.getConversations
);

// SEND MESSAGE
router.post(
  "/message",
  auth,
  upload.array(
    "attachments",
    10
  ),
  controller.sendMessage
);
// GET CONVERSATION MESSAGES
router.get(
  "/message/:conversationId",
  auth,
  controller.getMessages
);

router.patch(
  "/message/read/:conversationId",
  auth,
  controller.markAsRead
);

module.exports = router;
