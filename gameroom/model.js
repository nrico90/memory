const Sequelize = require("sequelize");
const db = require("../db_user");

const Room = db.define("room", {
  name: Sequelize.STRING
});

module.exports = Room;
