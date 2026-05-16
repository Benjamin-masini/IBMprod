const mongoose = require("mongoose");

const marketplaceSchema = new mongoose.Schema(
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
        "electronics",
        "fashion",
        "furniture",
        "vehicles",
        "services",
        "other",
      ],
      default: "other",
    },

    price: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      enum: ["new", "used"],
      default: "used",
    },

    images: [
      {
        type: String,
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Marketplace",
  marketplaceSchema
);