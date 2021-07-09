'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ride.belongsTo(models.User);
      Ride.belongsTo(models.Destination);
      Ride.hasMany(models.RideUser,{foreignKey:'ride_id'})

    }
  };
  Ride.init({
    departure: {
      type: DataTypes.DATE
    },
    end_date:{
      type:DataTypes.DATE
    },
    start_point:{
      type: DataTypes.STRING
    },
    fare_share:{
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    car_model: {
        type: DataTypes.STRING,
    },
    seats_available:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    driver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    driver_rating: {
      type: DataTypes.INTEGER, 
    },
    dest_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Destinations',
            key: 'id'
        }
    }
  }, {
    sequelize,
    modelName: 'Ride',
  });
  return Ride;
};