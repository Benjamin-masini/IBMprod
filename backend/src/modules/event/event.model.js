const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "conference",
        "concert",
        "education",
        "business",
        "festival",
        "other",
      ],
      default: "other",
    },

    location: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    accessType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    price: {
      type: Number,
      default: 0,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "ongoing",
        "finished",
      ],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Event",
  eventSchema
);