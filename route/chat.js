const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();

const multer = require("multer");
const upload = multer();
const chatController = require("../controller/chat");
const authUser = require("../middleware/auth");

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
  upload.single("file"),
  chatController.sendMessage
);
module.exports = router;
