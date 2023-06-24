const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();

const chatController = require("../controller/chat");
const authUser = require("../middleware/auth");

<<<<<<< HEAD
//for send
router.post(
  "/sendMessage",
  authUser.authenticate,
  jsonparser,
  chatController.sendMessage
);

//to get
router.get(
  "/getMessage",
  authUser.authenticate,
  jsonparser,
  chatController.getChat
);

// to fetchchat
//router.get("/", jsonparser, authUser.authenticate, chatController.fetchChat);

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
=======
router.get(
  "/getUserList",
  jsonparser,
  authUser.authenticate,
  chatController.getUserList
);
router.get(
  "/getMessage",
  jsonparser,
  authUser.authenticate,
  chatController.getMessage
);
router.post(
  "/sendMessage",
  jsonparser,
  authUser.authenticate,
  chatController.sendMessage
);
>>>>>>> settingGroup
module.exports = router;
