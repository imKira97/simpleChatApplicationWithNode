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
const Chat = require("./model/messages.js");

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

User.hasMany(Chat);
Chat.belongsTo(User);
sequelize
  .sync()
  .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT_NUMBER);
  })
  .catch((err) => {
    console.log(err);
  });
