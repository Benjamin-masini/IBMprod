const mongoose = require("mongoose");

const conversationSchema =
  new mongoose.Schema(
    {
      participants: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      itemId: {
        type:
          mongoose.Schema.Types.ObjectId,
      },

      itemType: {
        type: String,
        enum: [
          "property",
          "marketplace",
          "event",
          "library",
        ],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);