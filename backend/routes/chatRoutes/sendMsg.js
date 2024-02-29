const express = require("express");
const { body } = require("express-validator");
const { validatereq } = require("../../middlewares/validateReq");
const { sendMsg } = require("../../controllers/chatControllers");
const { Auth } = require("../../middlewares/auth");
const router = express.Router();
router.post(
  "/send-msg",
  Auth,
  [
    body("chatId").isMongoId().withMessage("chatId must be valid mongodb id."),
    body("msg")
      .isString()
      .withMessage("chatName must be valid string")
      .not()
      .isEmpty()
      .withMessage("chatName must be not empty"),
  ],
  validatereq,
  sendMsg
);
module.exports = { sendMsg: router };
