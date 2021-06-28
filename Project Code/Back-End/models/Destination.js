module.exports = function(sequelize, DataTypes){
    return sequelize.define('Destination', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false 
        },
        lang:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        address:{
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        classMethods: {
            associate: function(models) {
                Destination.hasMany(models.Ride,{foreignKey: 'dest_id'})
            }
        }
    })
};
