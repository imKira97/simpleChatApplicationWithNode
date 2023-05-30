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
const Group = require("./model/group");

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

//for group
User.belongsTo(Group, { foreignKey: "adminId", as: "adminOfGroups" });
User.belongsToMany(Group, {
  through: "user_Groups",
  foreignKey: "userId",
  otherKey: "GroupId",
});

Group.belongsTo(User, { foreignKey: "adminId", as: "admin" });
Group.belongsToMany(User, {
  through: "user_Groups",
  foreignKey: "GroupId",
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
