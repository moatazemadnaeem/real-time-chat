const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    IsValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const user = mongoose.model("user", UserSchema);
module.exports = { user };
