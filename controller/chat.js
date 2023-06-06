const sequelize = require("../util/database");
const Chat = require("../model/messages");
const User = require("../model/user");

exports.getMessage = async (req, res, next) => {
  try {
    /*
    The include option allows you to specify which associated models you want to include in the query result. */
    const { lastMessageId } = req.query;
    console.log("last Id " + lastMessageId);
    let messages = await Chat.findAll({
      include: {
        model: User,
      },
    });

    let index = 0;
    if (lastMessageId) {
      messages.forEach((chat) => {
        if (chat.id == lastMessageId) {
          index = lastMessageId;
        }
      });
    }
    messages = messages.slice(index);

    // const messageArr = messages.map((message) => ({
    //   id: message.userId,
    //   content: message.message,
    //   user: message.User.name,
    // }));
    const messageArr = [];

    for (const message of messages) {
      const user = await User.findByPk(message.userId);
      const name = user.name;

      messageArr.push({
        id: message.id,
        userid: message.userId,
        message: message.message,
        user: name,
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

    const chat = await Chat.create({
      message: messageText,
      userId: senderId,
    });
    //const messageData={loginUserId:req.user.id}
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "fail" });
  }
};
