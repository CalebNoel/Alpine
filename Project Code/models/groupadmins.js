'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupAdmins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupAdmins.belongsTo(models.User,{foreignKey: 'user_id' });
      GroupAdmins.belongsTo(models.Group,{foreignKey: 'group_id' });
    }
  };
  GroupAdmins.init({
    group_id:{
      type: DataTypes.INTEGER,
      references: {
          model: 'Groups',
          key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Users',
          key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'GroupAdmins',
  });
  return GroupAdmins;
};