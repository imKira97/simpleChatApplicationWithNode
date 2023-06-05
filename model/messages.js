const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Messages = sequelize.define("messages", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  message: {
    type: Sequelize.STRING,
  },
});
module.exports = Messages;
