"use strict";
const { Model } = require("sequelize");
const { allColors } = require("winston/lib/winston/config");
module.exports = (sequelize, DataTypes) => {
  class User_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Role.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "User_Role",
    }
  );
  return User_Role;
};
