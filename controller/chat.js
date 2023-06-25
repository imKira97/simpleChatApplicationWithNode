const sequelize = require("../util/database");
const Chat = require("../model/messages");
const User = require("../model/user");
const { Op } = require("sequelize");
exports.getUserList = async (req, res, next) => {
  try {
    const userList = await User.findAll({
      attributes: ["name", "id"],
      where: { id: { [Op.not]: req.user.id } },
    });

    console.table(userList);
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
  }
};
