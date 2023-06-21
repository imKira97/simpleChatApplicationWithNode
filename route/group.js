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
router.get(
  "/isAdmin",
  jsonparser,
  authUser.authenticate,
  groupController.isGroupAdmin
);

router.get(
  "/getAllUserFromGroup",
  jsonparser,
  authUser.authenticate,
  groupController.getAllUsersFromGroup
);

//not in group
router.get(
  "/usersNotInGroup",
  jsonparser,
  authUser.authenticate,
  groupController.getAllUsersNotInGroup
);

router.post(
  "/addNewUser",
  jsonparser,
  authUser.authenticate,
  groupController.addNewUsersInGroup
);

router.put(
  "/makeUserAdmin",
  jsonparser,
  authUser.authenticate,
  groupController.newAdmin
);
module.exports = router;
