const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const GroupUser = sequelize.define("groupUsers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
  },
});
module.exports = GroupUser;
