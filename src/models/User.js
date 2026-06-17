const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(
        "IT",
        "Penunjang",
        "Keuangan"
      ),
      allowNull: false,
    },

    is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    folder_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;