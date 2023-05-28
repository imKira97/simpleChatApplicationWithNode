const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Messages = sequelize.define("messages", {
  senderId: {
    type: Sequelize.INTEGER,
  },
  content: {
    type: Sequelize.STRING,
  },
  chatId: {
    type: Sequelize.INTEGER,
  },
});
module.exports = Messages;
