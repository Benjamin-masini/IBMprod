const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    category: {
      type: String,
      enum: ["house", "apartment", "land", "office"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Property",
  propertySchema
);