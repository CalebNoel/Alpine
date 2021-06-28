module.exports = function(sequelize, DataTypes){
    return sequelize.define('Group', {
       temp: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
       }
    },
    {
        classMethods: {
            associate: function(models) {
                Group.hasMany(models.GroupLine,{foreignKey: 'group_id'})
            }
        }
    })
};
