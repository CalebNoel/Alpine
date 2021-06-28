module.exports = function(sequelize, DataTypes){
    return sequelize.define('ChatLine', {
       user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
       },
       chat_id:{
            type: DataTypes.INTEGER,
            references: {
                model: 'Chats',
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
                ChatLine.belongsTo(models.User);
                ChatLine.belongsTo(models.Chat);
            }
        }
    })
};
