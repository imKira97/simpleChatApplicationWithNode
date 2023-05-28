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

// to fetchchat
//router.get("/", jsonparser, authUser.authenticate, chatController.fetchChat);

// to accessChat
router.post(
  "/access",
  jsonparser,
  authUser.authenticate,
  chatController.accessChat
);

// //for groupchat
// router.post(
//   "/createGroup",
//   jsonparser,
//   authUser.authenticate,
//   chatController.createGroup
// );

// //for rename
// router.put(
//   "/renameGroup",
//   jsonparser,
//   authUser.authenticate,
//   chatController.renameGroup
// );
// //for remove
// router.put(
//   "/removeFromGroup",
//   jsonparser,
//   authUser.authenticate,
//   chatController.removeUserFromGroup
// );

// //for add
// router.put(
//   "/addUser",
//   authUser.authenticate,
//   jsonparser,
//   chatController.addUser
// );
module.exports = router;
