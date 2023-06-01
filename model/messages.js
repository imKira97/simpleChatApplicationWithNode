const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Messages = sequelize.define("messages", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  sender_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  test: {
    type: Sequelize.STRING,
  },
});
module.exports = Messages;
