'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RideUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RideUser.belongsTo(models.User);
      RideUser.belongsTo(models.Ride);
    }
  };
  RideUser.init({
    ride_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'Rides',
          key: 'id'
      }
    },
    user_id:{
          type: DataTypes.INTEGER,
          references: {
              model: 'Users',
              key: 'id'
          }
    },
    rider_rating:{
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'RideUser',
  });
  return RideUser;
};