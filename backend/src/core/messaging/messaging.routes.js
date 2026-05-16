const express = require("express");

const router = express.Router();

const controller = require(
  "./messaging.controller"
);

const auth = require(
  "../../middleware/auth.middleware"
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