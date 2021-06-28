module.exports = function(sequelize, DataTypes){
    return sequelize.define('RideUser', {
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
       }
    },
    {
        classMethods: {
            associate: function(models) {
                RideUser.belongsTo(models.User);
                RideUser.belongsTo(models.Ride);
            }
        }
    })
};
