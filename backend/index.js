//Package requiring
require("dotenv").config();
require("express-async-errors");
const { app, server } = require("./socket/socket");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
//Middleware requiring
const { handelerr } = require("./middlewares/handelError");
//Error classes requiring
const { notfound } = require("./errorclasses/notfound");
const { BadReqErr } = require("./errorclasses/badReq");
//---Routes---
//UserRoutes
const { signup } = require("./routes/userRoutes/signup");
const { signin } = require("./routes/userRoutes/signin");
const { signout } = require("./routes/userRoutes/signout");
const { current } = require("./routes/userRoutes/current-user");
const { verfiyUserRoute } = require("./routes/userRoutes/verfiy-user");
const { search_users } = require("./routes/userRoutes/search-users");
//chatRoutes
const { createChat } = require("./routes/chatRoutes/createChat");
const { getChatsByUser } = require("./routes/chatRoutes/getChatsByUser");
const { sendMsg } = require("./routes/chatRoutes/sendMsg");
const { getMessagesByChat } = require("./routes/chatRoutes/getMessagesByChat");

//Initialization of the server
const port = process.env.PORT || 9000;
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["get", "post", "patch", "delete", "put"],
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(
  cookieSession({
    signed: false,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
);
//userMiddlewares
app.use("/api/users", signup);
app.use("/api/users", signin);
app.use("/api/users", signout);
app.use("/api/users", current);
app.use("/api/users", verfiyUserRoute);
app.use("/api/users", search_users);
//chatMiddlewares
app.use("/api/chat", createChat);
app.use("/api/chat", getChatsByUser);
app.use("/api/chat", sendMsg);
app.use("/api/chat", getMessagesByChat);

app.all("*", () => {
  throw new notfound("can not find this page please try again");
});
app.use(handelerr);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new BadReqErr("Jwt is not defined");
  }
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to db");
    server.listen(port, () => {
      console.log(`listening in port ${port}`);
    });
  } catch (err) {
    console.log(err, "err to connect");
  }
};

start();
