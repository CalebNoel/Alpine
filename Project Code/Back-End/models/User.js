module.exports = function(sequelize, DataTypes){
    return sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false 
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_no: {
            type: DataTypes.STRING(11),
            allowNull: false
        },
        dob: {
            type: DataTypes.DATEONLY,
        },
        gender: {
            type: DataTypes.ENUM,
            values: ['male', 'female', 'other']
        }
    },
    {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Ride,{foreignKey: 'driver_id'})
                User.hasMany(models.ChatLine,{foreignKey: 'user_id'})
                User.hasMany(models.RideUser,{foreignKey: 'rider_id'})
                User.hasMany(models.GroupLine,{foreignKey: 'user_id'})
            }
        }
    })
};
