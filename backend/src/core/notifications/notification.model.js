const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      type: {
        type: String,
        enum: [
          "message",
          "favorite",
          "property",
          "marketplace",
          "library",
          "event",
          "system",
        ],
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      itemId: {
        type:
          mongoose.Schema.Types.ObjectId,
      },

      itemType: {
        type: String,
        enum: [
          "property",
          "marketplace",
          "library",
          "event",
        ],
      },

      isRead: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);