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
const groupRoute = require("./route/group");
//Model
const User = require("./model/user");
const Chat = require("./model/messages.js");
const Group = require("./model/group");
const GroupUser = require("./model/groupUser");

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
app.use(groupRoute);

User.hasMany(Chat, { constraints: true, onDelete: "CASCADE" });
Chat.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

Group.hasMany(Chat, { constraints: true, onDelete: "CASCADE" });
Chat.belongsTo(Group);

console.log("MY CHAT APP");
//groupuser and user
GroupUser.belongsTo(User, { foreignKey: "userId" });
User.hasMany(GroupUser, { foreignKey: "userId" });
sequelize
  .sync()
  .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT_NUMBER);
  })
  .catch((err) => {
    console.log(err);
  });
