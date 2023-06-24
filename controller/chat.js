const sequelize = require("../util/database");
<<<<<<< HEAD
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

    return res.status(201).json({
      message: "success",
      recUser: receiverUser.name,
      recId: receiverUser.id,
    });
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
        id: messages.id,
      };
    });
    const data = {
      senderName: req.user.name,
      recieverName: reciever,
      messageData: extractMessage,
    };
    return res.status(200).json({ chatData: data, success: "true" });
  } catch (err) {
    console.log(err);
=======
const Chat = require("../model/messages");
const User = require("../model/user");
const { Op } = require("sequelize");
exports.getUserList = async (req, res, next) => {
  try {
    const userList = await User.findAll({
      attributes: ["name", "id"],
      where: { id: { [Op.not]: req.user.id } },
    });

    console.log(userList);
    return res.status(201).json({ userList: userList, message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "not able to get User" });
  }
};
exports.getMessage = async (req, res, next) => {
  try {
    /*
    The include option allows you to specify which associated models you want to include in the query result. */
    const { lastMessageId, groupId } = req.query;
    let messages = await Chat.findAll({
      where: {
        groupId: groupId,
        id: { [Op.gt]: lastMessageId },
      },
      include: [{ model: User, attributes: ["name", "id"] }],
    });

    //console.table(JSON.parse(JSON.stringify(messages)));

    let index = 0;
    if (lastMessageId) {
      messages.forEach((chat) => {
        if (chat.id == lastMessageId) {
          index = lastMessageId;
        }
      });
    }
    messages = messages.slice(index);

    const messageArr = [];
    for (const message of messages) {
      const user = await User.findByPk(message.userId);
      const name = user.name;

      messageArr.push({
        id: message.id,
        userid: message.userId,
        message: message.message,
        user: name,
        groupId: message.groupId,
      });
    }

    const messageData = { loginUser: req.user.id, messages: messageArr };
    return res.status(201).json({ success: true, data: messageData });
  } catch (err) {
    console.log(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const messageText = req.body.messageText;
    const senderId = req.user.id;
    const groupId = req.body.groupId;
    console.log("groupId", groupId);
    const chat = await Chat.create({
      message: messageText,
      groupId: groupId,
      userId: senderId,
    });
    //const messageData={loginUserId:req.user.id}
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "fail" });
>>>>>>> settingGroup
  }
};
