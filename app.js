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
//Model
const User = require("./model/user");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRoute);
sequelize
  .sync()
  .then((result) => {
    console.log("server running");
    app.listen(process.env.PORT_NUMBER);
  })
  .catch((err) => {
    console.log(err);
  });
