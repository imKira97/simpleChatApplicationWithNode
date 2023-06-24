const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();
const authUser = require("../middleware/auth");

const userController = require("../controller/user");
<<<<<<< HEAD
router.get(
  "/user/getUser",
  authUser.authenticate,
  jsonparser,
  userController.getUser
);
=======

const authUser = require("../middleware/auth");
//getUserName
router.get("/", jsonparser, authUser.authenticate, userController.getUserName);
>>>>>>> settingGroup
router.post("/user/signUp", jsonparser, userController.newUser);
router.post("/user/login", jsonparser, userController.loginUser);

router.get(
  "/searchUser",
  authUser.authenticate,
  jsonparser,
  userController.searchUser
);

module.exports = router;
