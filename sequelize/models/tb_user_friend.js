module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_user_friend', {
        seq: {
            type: DataTypes.INTEGER,
            allowNull: true,
            //autoIncrement: true 
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        friend_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
        }
    },{
        timestamps: false,
    //    tableName:'tb_user_friend' //해당옵션이 없으면 테이블 네임에서s를 붙인다.
    //    createdAt: true,
     //   updatedAt: false
    });
}