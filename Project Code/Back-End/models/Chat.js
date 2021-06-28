module.exports = function(sequelize, DataTypes){
    return sequelize.define('Chat', {
       temp: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
       }
    },
    {
        classMethods: {
            associate: function(models) {
                Chat.hasMany(models.ChatLine,{foreignKey: 'chat_id'})
            }
        }
    })
};
