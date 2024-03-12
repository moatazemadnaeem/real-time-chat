const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require("express");
const { NotAuth } = require("../errorclasses/notauth");
const { BadReqErr } = require("../errorclasses/badReq");
const jwt = require("jsonwebtoken");
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["get", "post", "patch", "delete", "put"],
  },
});
const handleSocketAuth = (socket) => {
  let payload;
  try {
    const token = socket.handshake.headers.authentication;
    payload = jwt.verify(token, process.env.JWT_KEY);
    if (!token || !payload) {
      return undefined;
    }
    return payload?.id;
  } catch (error) {
    return undefined;
  }
};
io.use((socket, next) => {
  let payload;
  try {
    const token = socket.handshake.headers.authentication;
    if (!token) {
      return next(new NotAuth("Not Authenticated"));
    }
    payload = jwt.verify(token, process.env.JWT_KEY);
    if (!payload) {
      return next(new NotAuth("Not Authenticated"));
    }
  } catch (error) {
    return next(new BadReqErr(error.message || "something went wrong!"));
  }
  return next();
});
const onlineUsers = {};
io.on("connection", (socket) => {
  let userId = handleSocketAuth(socket);
  console.log("user connected", userId);
  if (userId) onlineUsers[userId] = userId;
  io.emit("onlineUsers", Object.keys(onlineUsers));
  socket.on("message", (data) => {
    io.emit(data.chatId, data);
  });
  socket.on("chatCreated", (data) => {
    io.emit("chat", data);
  });
  socket.on("disconnect", () => {
    console.log(`user is disconnected`);
    delete onlineUsers[userId];
    console.log(onlineUsers);
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

module.exports = { app, io, server };
