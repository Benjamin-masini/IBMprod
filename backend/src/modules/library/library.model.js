const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema(
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

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "education",
        "business",
        "technology",
        "novel",
        "science",
        "other",
      ],
      default: "other",
    },

    coverImage: {
      type: String,
    },

    pdfFile: {
      type: String,
      required: true,
    },

    accessType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    price: {
      type: Number,
      default: 0,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Library",
  librarySchema
);