const sequelize = require("../util/database");
const Chat = require("../model/chat");

exports.sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipentId = 1111;
    const messageTxt = req.body.messageText;
    const msgDate = req.body.dateTime;

    console.log(userId, recipentId, messageTxt, msgDate);
    const messageData = await Chat.create({
      userId: userId,
      recipentId: recipentId,
      text: messageTxt,
      dateTime: msgDate,
    });
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "failed" });
  }
};
