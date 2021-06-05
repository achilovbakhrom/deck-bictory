const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres",
  "postgres",
  "0887",
  {
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 30,
      min: 0,      
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.role = require("./role")(sequelize, Sequelize);
db.currency = require("./currency")(sequelize, Sequelize);
db.nationality = require("./nationality")(sequelize, Sequelize);
db.message = require("./message")(sequelize, Sequelize);
db.homeEmail = require("./homeEmail")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

// messages
db.user.hasMany(db.message);
db.message.belongsTo(db.user);

// messages nationality
db.message.belongsTo(db.nationality);
db.nationality.hasOne(db.message);

db.currency.hasOne(db.message);
db.message.belongsTo(db.currency);

db.ROLES = ["user", "admin"];

module.exports = db;
