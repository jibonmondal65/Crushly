const mongoose = require("mongoose");

const crushSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toFirstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    toLastName: {
      type: String,
      lowercase: true,
      trim: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    matchLevel: {
      type: String,
      enum: ["none", "full"],
      default: "none",
    },

    fromConfirmed: { type: Boolean, default: false },
    toConfirmed: { type: Boolean, default: false },
    isFinalMatch: { type: Boolean, default: false },

    pairKey: {
      type: String,
      index: true,
      validate: {
        validator: function (v) {
          if (this.toUser && !v) return false;
          return true;
        },
        message: "pairKey is required when toUser exists",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crush", crushSchema);
