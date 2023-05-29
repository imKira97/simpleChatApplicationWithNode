require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var cors = require("cors");
const fs = require("fs");
const sequelize = require("./util/database");

const app = express();

//route
const userRoute = require("./route/user");
const chatRoute = require("./route/chat");
//Model
const User = require("./model/user");
const Chat = require("./model/chat");
const Conversation = require("./model/conversation");

app.use(
  cors({
    //to enable from any origin
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRoute);
app.use(chatRoute);

// Associations
User.hasMany(Chat, { foreignKey: "senderId", as: "sentMessages" });
User.hasMany(Chat, { foreignKey: "receiverId", as: "receivedMessages" });
User.belongsToMany(Conversation, {
  through: "user_conversations",
  foreignKey: "userId",
  otherKey: "conversationId",
});
Conversation.belongsToMany(User, {
  through: "user_conversations",
  foreignKey: "conversationId",
  otherKey: "userId",
});
Chat.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Chat.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

sequelize
  .sync()
  .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT_NUMBER);
  })
  .catch((err) => {
    console.log(err);
  });
