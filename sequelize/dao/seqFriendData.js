
var {Friend} = require('../models');
const session = require('../../session/sessionProcess.js');



const logger = require('../../logger');

exports.selectFriend = function(request,response){ 
    
    Friend.findAll({
    where:{
       user_id:request.query.id,
    },  
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


