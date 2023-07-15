
var {Friend,Master,Sequelize} = require('../models');
const session = require('../../session/sessionProcess.js');



const logger = require('../../logger');

exports.selectFriend = function(request,response){ 
    

  Friend.belongsTo(Master, {
    foreignKey: 'friend_id', 
    targetKey:'user_id'
   // as: 'Master' 
  });

    Friend.findAll({
    where:{
       user_id:request.query.id,
    },  
    include:[{
      model:Master,
 
      attributes: ['id', 'is_login'],
     // where: { id: Sequelize.col('Friend.id') },
    }],
    raw:true
    })
  .then((user) => {
    logger.info('친구 목록 조회 완료');
    console.log(user);
    if(user.length > 0){
        response.send(user);
      }else response.send('fail');

  }).catch((error)=>{logger.error(error)});



  
  }


