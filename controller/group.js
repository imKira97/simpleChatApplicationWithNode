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
    const groupId = req.query.groupId;

    const groupUsers = await GroupUser.findAll({
      where: { groupId: groupId },
      include: User,
    });

    //console.table(JSON.parse(JSON.stringify(groupUsers)));
    const users = groupUsers.map((groupUser) => ({
      isAdmin: groupUser.isAdmin,
      id: groupUser.user.id,
      name: groupUser.user.name,
    }));
    res.status(200).json({ message: "success", data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsersNotInGroup = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const users = await User.findAll({
      attributes: ["id", "name"],
      where: {
        id: {
          [Op.notIn]: sequelize.literal(
            `(SELECT userId FROM groupUsers WHERE groupId = ${groupId})`
          ),
        },
      },
    });

    console.table(JSON.parse(JSON.stringify(users)));

    res.status(200).json({ message: "success", data: users });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.addNewUsersInGroup = async (req, res, next) => {
  try {
    console.log(req.body);

    const groupId = req.body.groupId;
    const newMembers = req.body.newMembers;

    const result = await Promise.all(
      newMembers.map(async (member) => {
        await GroupUser.create({
          groupId: groupId,
          userId: member.id,
        });
      })
    );

    return res.status(200).json({ message: "new members added" });
  } catch (err) {
    console.log(err);
  }
};

exports.newAdmin = async (req, res, next) => {
  try {
    console.log("new admin ");
    const userId = req.body.userId;
    const groupId = req.body.groupId;
    const groupName = req.body.groupName;

    await GroupUser.update({ isAdmin: true }, { where: { userId, groupId } });
    const newAdmin = await Group.create({
      groupName: groupName,
      admin: userId,
      groupId: groupId,
    });

    return res.status(200).json({ message: "new admin" });
  } catch (err) {
    console.log(err);
  }
};

exports.removeUserFromGroup = async (req, res, next) => {
  try {
    console.log("In remove user");
    const userId = req.body.userId;
    const groupId = req.body.groupId;

    //find the group
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    //1st we will check if user is member or not then we will destroy it
    const groupUser = await GroupUser.findOne({
      where: { groupId: groupId, userId: userId },
    });
    if (!groupUser) {
      return res.status(404).json({ message: "User not found in group" });
    }

    await groupUser.destroy();
    return res
      .status(200)
      .json({ message: "User removed from group successfully" });
  } catch (err) {
    console.log(err);
  }
};
