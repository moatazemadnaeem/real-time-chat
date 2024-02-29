const { chat } = require("../models/chatModel");
const { user } = require("../models/userModel");
const { BadReqErr } = require("../errorclasses/badReq");
const { NotAuth } = require("../errorclasses/notauth");
const { notfound } = require("../errorclasses/notfound");
module.exports = {
  create_chat: async (req, res) => {
    try {
      const { usersInChat, isGroup, chatName } = req.body;
      let name = "No Name";
      if (!isGroup) {
        const fetchedUser = await user.findById(usersInChat[0]);
        name = fetchedUser.name;
      } else {
        name = chatName;
      }
      const userId = req.currentUser.id;
      for (let i = 0; i < usersInChat.length; i++) {
        if (usersInChat[i].toString() === userId.toString()) {
          throw new BadReqErr("You can not add your self");
        }
      }
      if (!isGroup) {
        const exists = await chat.findOne({
          isGroup: false,
          usersInChat: { $in: usersInChat[0] },
        });
        if (exists) {
          throw new BadReqErr("this person is aleardy you are chating with");
        }
      }
      if (isGroup) {
        const chatNameExists = await chat.findOne({
          isGroup: true,
          chatName,
        });
        if (chatNameExists) {
          throw new BadReqErr("chatName must be unique!");
        }
      }
      const User = await user.findById(userId);
      if (!User) {
        throw new notfound("Can not find the user");
      }
      const savedChat = await chat.create({
        chatName: name,
        userId,
        usersInChat,
        isGroup,
        chatCreatorName: User.name,
      });
      res
        .status(201)
        .send({ chat: savedChat, msg: "its done creating the chat" });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
  getChatsByUser: async (req, res) => {
    try {
      const userId = req.currentUser.id;

      const Chats = await chat
        .find({
          $or: [{ userId: userId }, { usersInChat: { $in: [userId] } }],
        })
        .populate("usersInChat");
      if (!Chats) {
        throw new notfound("Can not find the chats");
      }
      const getChatName = (val) => {
        if (val.isGroup) {
          return val.chatName;
        } else {
          if (val.userId.toString() !== userId) {
            return val.chatCreatorName;
          }
          return val.chatName;
        }
      };
      const newChats = Chats.map((val) => {
        return {
          ...val.toObject(),
          chatName: getChatName(val),
        };
      });
      res
        .status(200)
        .send({ chats: newChats, msg: "its done getting the chats" });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
  sendMsg: async (req, res) => {
    try {
      const { msg, chatId } = req.body;
      const userId = req.currentUser.id;
      const fetchedChat = await chat.findById(chatId);
      if (!fetchedChat) {
        throw new notfound("Can not find the chat");
      }
      fetchedChat.messages.push({
        senderId: userId,
        msg,
      });
      await fetchedChat.save();
      res.status(200).send({
        text: fetchedChat.messages[fetchedChat.messages.length - 1],
        msg: "its done sending the message",
      });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
  getMessagesByChat: async (req, res) => {
    try {
      const { chatId } = req.body;
      const userId = req.currentUser.id;
      const fetchedChat = await chat.findOne({
        _id: chatId,
        $or: [{ userId }, { usersInChat: { $in: [userId] } }],
      });
      if (!fetchedChat) {
        throw new notfound("Can not find the chat");
      }

      const messages = fetchedChat.messages;
      res.status(200).send({
        messages,
        msg: "its done sending all the messages for this chat",
      });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
};
