const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define(
  "documents",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    drive_file_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    web_view_link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    visibility: {
      type: DataTypes.ENUM(
        "Private",
        "Role",
        "Public"
      ),
      defaultValue: "Private",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Document;