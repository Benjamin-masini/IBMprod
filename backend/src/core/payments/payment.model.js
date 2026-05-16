const mongoose = require("mongoose");

const paymentSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      itemId: {
        type:
          mongoose.Schema.Types.ObjectId,
      },

      itemType: {
        type: String,
        enum: [
          "library",
          "event",
          "marketplace",
        ],
      },

      amount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        default: "usd",
      },

      provider: {
        type: String,
        enum: [
          "stripe",
          "paypal",
          "mobile_money",
        ],
        default: "stripe",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "completed",
          "failed",
        ],
        default: "pending",
      },

      transactionId: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);