const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  recipentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dateTime: {
    type: Sequelize.DATE,
  },
});
module.exports = Chat;
