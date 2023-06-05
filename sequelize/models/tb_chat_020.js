module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_chat_020', {
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        contents: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        contents_length: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        update_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{
        timestamps: false,
    //    tableName:'tb_user_friend' //해당옵션이 없으면 테이블 네임에서s를 붙인다.
    //    createdAt: true,
     //   updatedAt: false
    });
}