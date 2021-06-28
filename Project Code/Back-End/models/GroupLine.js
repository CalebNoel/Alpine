module.exports = function(sequelize, DataTypes){
    return sequelize.define('GroupLine', {
       user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
       },
       group_id:{
            type: DataTypes.INTEGER,
            references: {
                model: 'Groups',
                key: 'id'
            }
       },
       line_text: {
            type: DataTypes.STRING,
            allowNull: false,
       }
    },
    {
        classMethods: {
            associate: function(models) {
                GroupLine.belongsTo(models.User);
                GroupLine.belongsTo(models.Group);
            }
        }
    })
};
