const sequelize = require("../util/database");
const Chat = require("../model/messages");
const User = require("../model/user");
const { Op } = require("sequelize");
const Group = require("../model/group");
const GroupUser = require("../model/groupUser");

exports.getGroup = async (req, res, next) => {
  try {
    const results = await req.user.getGroups({
      attributes: ["id", "groupName"],
    });

    return res.status(201).json({ message: "success", results });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    console.log("here");
    const groupName = req.body.groupName;
    const members = req.body.members;
    const admin = req.user.id;
    console.log();
    console.log("      " + members);
    console.log();
    const group = await Group.create({
      groupName: groupName,
      admin: admin,
    });

    await GroupUser.create({
      groupId: group.id,
      userId: req.user.id,
      isAdmin: true,
    });
    await Promise.all(
      members.map(async (member) => {
        await GroupUser.create({
          groupId: group.id,
          userId: member.id,
        });
      })
    );

    res.status(201).json({ message: "groupCreated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
