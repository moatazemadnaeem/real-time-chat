const express = require("express");
const { getChatsByUser } = require("../../controllers/chatControllers");
const { Auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/get-chats-by-user", Auth, getChatsByUser);
module.exports = { getChatsByUser: router };
