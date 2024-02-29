const express = require("express");
const { body } = require("express-validator");
const { validatereq } = require("../../middlewares/validateReq");
const { create_chat } = require("../../controllers/chatControllers");
const { Auth } = require("../../middlewares/auth");
const mongoose = require("mongoose");
const router = express.Router();
const checkUsersInChat = (val, req) => {
  if (!Array.isArray(val) || val.length === 0) {
    return Promise.reject("usersInChat should have at least one user");
  }
  for (let i = 0; i < val.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(val[i].toString())) {
      return Promise.reject("usersInChat items should be valid mongoDB ID.");
    }
  }
  return Promise.resolve();
};
const checkIsGroup = (val, req) => {
  if (req.body.usersInChat.length > 1) {
    if (val) {
      return Promise.resolve();
    }
    return Promise.reject(
      "The users provided means that you created a group chat"
    );
  }
  return Promise.resolve();
};
router.post(
  "/create-chat",
  Auth,
  [
    body("usersInChat").custom((val) => checkUsersInChat(val)),
    body("isGroup")
      .isBoolean()
      .withMessage("isGroup must be valid bool")
      .custom((val, { req }) => checkIsGroup(val, req)),
    body("chatName")
      .if((value, { req }) => req.body.isGroup) // Only check if isGroup is true
      .isString()
      .withMessage("chatName must be valid string")
      .not()
      .isEmpty()
      .withMessage("chatName must be not empty"),
  ],
  validatereq,
  create_chat
);
module.exports = { createChat: router };
