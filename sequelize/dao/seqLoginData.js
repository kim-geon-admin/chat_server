
var {Master} = require('../models');
const session = require('../../session/sessionProcess.js');



const logger = require('../../logger');

exports.selectUser = function(request,response){ 
    
  Master.findOne({where:{
    user_id:request.query.id,
    user_password:request.query.password
    }})
  .then((user) => {
    logger.info(`사용자 로그인 성공 ${user.dataValues.user_id} `);
    console.log(user);
    if(user.dataValues.user_id != ''){
        session.loginSession(request,response);
        response.send('success');
      }else response.send('fail');

  }).catch((error)=>{logger.error(error)});
  
  }


