const sequelize = require("../util/database");
const Chat = require("../model/messages");
const User = require("../model/user");
const { Op } = require("sequelize");
const Group = require("../model/group");
const GroupUser = require("../model/groupUser");

exports.isGroupAdmin = async (req, res, next) => {
  try {
    console.log("here");

    const groupId = req.query.groupId;

    const isUserAdmin = await GroupUser.findOne({
      where: { isAdmin: true, userId: req.user.id, groupId: groupId },
    });
    if (isUserAdmin) {
      return res.status(201).json({ message: "success", isUserAdmin: "true" });
    } else {
      return res.status(201).json({ message: "success", isUserAdmin: "false" });
    }
  } catch (err) {
    console.log(err);
  }
};
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

exports.getAllUsersFromGroup = async (req, res, next) => {
  try {
    console.log("in get all users from group");
    const groupId = req.query.groupId;
    console.log("groupId");
    const groupUsers = await GroupUser.findAll({
      where: { groupId: groupId },
      include: User,
    });

    console.table(JSON.parse(JSON.stringify(groupUsers)));
    const users = groupUsers.map((groupUser) => ({
      isAdmin: groupUser.isAdmin,
      id: groupUser.user.id,
      name: groupUser.user.name,
    }));
    console.log(users);
    res.status(200).json({ message: "success", data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
