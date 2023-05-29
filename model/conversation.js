/*This table will represent individual conversations between two users.

Columns: id (primary key), user1_id (foreign key referencing User table), user2_id (foreign key referencing User table), 
 */
const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");
const Conversation = sequelize.define("conversations", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user1Id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  user2Id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  // Add more columns for extra functionalities
  // For example, to store the group name
  groupName: {
    type: Sequelize.STRING,
  },
});
module.exports = Conversation;
