const User = require("./User");
const Document = require("./Document");

User.hasMany(Document, {
  foreignKey: "user_id",
});

Document.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = {
  User,
  Document,
};