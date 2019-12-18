const Sequelize = require("sequelize");
const db = require("../db_user");
const User = require("../user/model");

const Room = db.define("room", {
  name: Sequelize.STRING
});

//important
User.belongsTo(Room);
Room.hasMany(User);

module.exports = Room;
