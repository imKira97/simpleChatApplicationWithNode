require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
var cors = require("cors");
const fs = require("fs");
const sequelize = require("./util/database");

const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("getgroupId", (groupId) => {
    console.log("groupid is " + groupId);
    socket.join(groupId);
  });
  socket.on("sendmessage", (data) => {
    socket.broadcast.emit("receivemessage", data);
    //io.to(data.groupId).emit("receivemessage", data);
  });
});

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

//serving files

app.use((req, res) => {
  console.log("url" + req.url);
  res.sendFile(path.join(__dirname, `./frontend/${req.url}`));
});
User.hasMany(Chat, { constraints: true, onDelete: "CASCADE" });
Chat.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

Group.hasMany(Chat, { constraints: true, onDelete: "CASCADE" });
Chat.belongsTo(Group);

//groupuser and user
GroupUser.belongsTo(User, { foreignKey: "userId" });
User.hasMany(GroupUser, { foreignKey: "userId" });
sequelize
  .sync()
  .then((result) => {
    console.log("server running");
    //app.listen(process.env.PORT_NUMBER);
    server.listen(process.env.PORT_NUMBER);
  })
  .catch((err) => {
    console.log(err);
  });
