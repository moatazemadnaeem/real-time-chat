const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chatName: {
      type: String,
      required: true,
      unique: true,
    },
    chatCreatorName: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    usersInChat: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        msg: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
const chat = mongoose.model("chat", chatSchema);
module.exports = { chat };
