const sequelize = require("../util/database");
const Chat = require("../model/messages");
const User = require("../model/user");
const { Op } = require("sequelize");
const fs = require("fs");
const AWS = require("aws-sdk");

async function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET_ID = process.env.IAM_USER_SECRET_ID;

  //creating s3 instance
  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET_ID,
  });

  //let base64data = Buffer.from(JSON.stringify(data));
  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        console.log("Something Went Wrong in Upload", err);
        reject(err);
      } else {
        resolve(s3Response.Location);
      }
    });
  });
}

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
    console.log("send message");
    console.dir(JSON.stringify(req.body));
    const file = req.file;

    const senderId = req.user.id;
    const groupId = req.body.groupId;

    console.log("file is " + file);
    if (file) {
      fileName = req.body.messageText;
      const fileUrl = await uploadToS3(file.buffer, fileName);
      console.log("url is" + fileUrl);
      const chat = await Chat.create({
        message: fileUrl,
        groupId: groupId,
        userId: senderId,
      });
    } else {
      const chat = await Chat.create({
        message: req.body.messageText,
        groupId: groupId,
        userId: senderId,
      });
    }

    //const messageData={loginUserId:req.user.id}
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "fail" });
  }
};
