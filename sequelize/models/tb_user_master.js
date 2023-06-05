module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_user_master', {
        user_id: {
        /* column 속성들 */
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        /*   여기까지    */
        },
        user_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_password: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    },{
        timestamps: false,
    //    tableName:'tb_user_master' //해당옵션이 없으면 테이블 네임에서s를 붙인다.
    //    createdAt: true,
     //   updatedAt: false
    });
}