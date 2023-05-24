const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();

const chatController = require("../controller/chat");
const authUser = require("../middleware/auth");

router.post(
  "/sendMessage",
  jsonparser,
  authUser.authenticate,
  chatController.sendMessage
);
module.exports = router;
