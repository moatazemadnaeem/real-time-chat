const express = require("express");
const { body } = require("express-validator");
const { validatereq } = require("../../middlewares/validateReq");
const { getMessagesByChat } = require("../../controllers/chatControllers");
const { Auth } = require("../../middlewares/auth");
const router = express.Router();
router.post(
  "/get-messages-by-chat",
  Auth,
  [body("chatId").isMongoId().withMessage("chatId must be valid mongodb id.")],
  validatereq,
  getMessagesByChat
);
module.exports = { getMessagesByChat: router };
