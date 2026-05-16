const messagingService = require(
  "./messaging.service"
);

exports.createConversation =
  async (req, res) => {
    try {
      const conversation =
        await messagingService.createConversation(
          req.body.participants,
          req.body.itemId,
          req.body.itemType
        );

      res.status(201).json(
        conversation
      );
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };

exports.markAsRead = async (
  req,
  res
) => {
  try {
    await messagingService.markMessagesAsRead(
      req.params.conversationId,
      req.user.id
    );

    res.json({
      message:
        "Messages marked as read",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.sendMessage = async (
  req,
  res
) => {
  try {
    const message =
      await messagingService.sendMessage(
        {
          conversationId:
            req.body
              .conversationId,

          sender:
            req.user.id,

          content:
            req.body.content,

          files: req.files,
        }
      );

    res.status(201).json(
      message
    );
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await messagingService.getMessages(
        req.params.conversationId
      );

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getConversations =
  async (req, res) => {
    try {
      const conversations =
        await messagingService.getUserConversations(
          req.user.id
        );

      res.json(conversations);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
