const sequelize = require("../util/database");
const Chat = require("../model/messages");
const User = require("../model/user");

exports.getMessage = async (req, res, next) => {
  try {
    let messages = await Chat.findAll();
    let messageArr = Object.entries(messages);
    return res.status(201).json({ success: true, messages: messageArr });
  } catch (err) {
    console.log(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const messageText = req.body.messageText;
    const senderId = req.user.id;

    const chat = await Chat.create({
      message: messageText,
      userId: senderId,
    });

    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "fail" });
  }
};
