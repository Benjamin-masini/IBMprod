const notificationService = require(
  "./notification.service.js"
);

exports.getNotifications =
  async (req, res) => {
    try {
      const notifications =
        await notificationService.getUserNotifications(
          req.user.id
        );

      res.json(notifications);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );

    res.json(notification);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteNotification =
  async (req, res) => {
    try {
      await notificationService.deleteNotification(
        req.params.id,
        req.user.id
      );

      res.json({
        message:
          "Notification deleted",
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
