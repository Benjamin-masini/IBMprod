const Conversation = require(
  "./conversation.model.js"
);

const Message = require(
  "./message.model.js"
);

const {
  getIO,
} = require("../../socket/socket.js");

exports.createConversation =
  async (
    participants,
    itemId,
    itemType
  ) => {
    const exists =
      await Conversation.findOne({
        participants: {
          $all: participants,
        },

        itemId,
        itemType,
      });

    if (exists) {
      return exists;
    }

    return await Conversation.create({
      participants,
      itemId,
      itemType,
    });
  };

exports.sendMessage = async ({
  conversationId,
  sender,
  content,
  files,
}) => {
  const attachments = files
    ? files.map((file) => ({
        fileUrl:
          file.path,

        fileType:
          file.mimetype,

        originalName:
          file.originalname,
      }))
    : [];

  const message =
    await Message.create({
      conversation:
        conversationId,

      sender,

      content,

      attachments,
    });

  // SOCKET
  const io = getIO();

  io.emit(
    "newMessage",
    message
  );

  return message;
};

exports.markMessagesAsRead =
  async (
    conversationId,
    userId
  ) => {
    await Message.updateMany(
      {
        conversation: conversationId,

        sender: {
          $ne: userId,
        },

        isRead: false,
      },

      {
        isRead: true,
      }
    );
    const {
      getIO,
    } = require("../../socket/socket");
    return true;
  };

exports.getMessages = async (
  conversationId
) => {
  return await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "username")
    .sort({ createdAt: 1 });
};

exports.getUserConversations =
  async (userId) => {
    return await Conversation.find({
      participants: userId,
    })
      .populate(
        "participants",
        "username email"
      )
      .sort({ updatedAt: -1 });
  };
