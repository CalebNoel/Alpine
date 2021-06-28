// const User = require("./User");
// const Destination = require("./User");

module.exports = function(sequelize, DataTypes){
    return sequelize.define('Ride', {
        departure: {
            type: DataTypes.DATE
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
        dest_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Destinations',
                key: 'id'
            }
        }
    },
    {
        classMethods: {
            associate: function(models) {
                Ride.belongsTo(models.User);
                Ride.belongsTo(models.Destination);
                Ride.hasMany(models.RideUser,{foreignKey:'ride_id'})
            }
        }
    })
};
