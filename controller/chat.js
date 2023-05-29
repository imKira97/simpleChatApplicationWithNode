const sequelize = require("../util/database");
const Chat = require("../model/chat");
const User = require("../model/user");
exports.sendMessage = async (req, res, next) => {
  try {
    const recipentId = req.body.recipientId;
    const messageTxt = req.body.messageText;

    const receiverUser = await User.findOne({ where: { id: recipentId } });
    if (!receiverUser) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    const chat = await Chat.create({
      senderId: req.user.id,
      receiverId: receiverUser.id,
      text: messageTxt,
    });
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "failed" });
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const reciever = req.query.reciever;
    const user2 = await User.findOne({ where: { name: reciever } });
    const messages = await Chat.findAll({
      where: {
        senderId: [req.user.id, user2.id],
        receiverId: [req.user.id, user2.id],
      },
      order: [["createdAt", "ASC"]],
    });
    //extract fields
    const extractMessage = messages.map((messages) => {
      return {
        senderId: messages.senderId,
        recieverId: messages.receiverId,
        chat: messages.text,
        multimedia: messages.media_url,
      };
    });
    return res.status(200).json({ messages: extractMessage });
  } catch (err) {
    console.log(err);
  }
};
