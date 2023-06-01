const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const jsonparser = bodyParser.json();

const userController = require("../controller/user");

const authUser = require("../middleware/auth");
//getUserName
router.get("/", jsonparser, authUser.authenticate, userController.getUserName);
router.post("/user/signUp", jsonparser, userController.newUser);
router.post("/user/login", jsonparser, userController.loginUser);

module.exports = router;
