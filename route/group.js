const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();
const authUser = require("../middleware/auth");

const groupController = require("../controller/group");
router.post(
  "/createGroup",
  jsonparser,
  authUser.authenticate,
  groupController.createGroup
);
router.get(
  "/getGroup",
  jsonparser,
  authUser.authenticate,
  groupController.getGroup
);

module.exports = router;
