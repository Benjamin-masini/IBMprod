const Notification = require(
  "./notification.model.js"
);

const {
  getIO,
} = require("../../socket/socket.js");

exports.createNotification =
  
  async ({
    recipient,
    sender,
    type,
    title,
    content,
    itemId,
    itemType,
  }) => {
    const notification =
      await Notification.create({
        recipient,
        sender,
        type,
        title,
        content,
        itemId,
        itemType,
      });

    const io = getIO();

    io.to(recipient.toString()).emit(
      "newNotification",
       notification
    );

    return notification;
  };

exports.getUserNotifications =
  async (userId) => {
    return await Notification.find({
      recipient: userId,
    })
      .populate(
        "sender",
        "username email"
      )
      .sort({ createdAt: -1 });
  };

exports.markAsRead = async (
  notificationId,
  userId
) => {
  const notification =
    await Notification.findById(
      notificationId
    );

  if (!notification) {
    throw new Error(
      "Notification not found"
    );
  }

  if (
    notification.recipient.toString() !==
    userId
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

exports.deleteNotification =
  async (
    notificationId,
    userId
  ) => {
    const notification =
      await Notification.findById(
        notificationId
      );

    if (!notification) {
      throw new Error(
        "Notification not found"
      );
    }

    if (
      notification.recipient.toString() !==
      userId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    await notification.deleteOne();

    return true;
  };
