//This table will store the messages exchanged between users in a conversation
const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  media_url: {
    type: Sequelize.STRING,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});
module.exports = Chat;
