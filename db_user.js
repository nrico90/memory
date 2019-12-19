const Sequelize = require("sequelize");
const databaseURL =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseURL);

db.sync({ force: false })
  .then(() => console.log("the database schema has been update"))
  .catch(console.error);

module.exports = db;
