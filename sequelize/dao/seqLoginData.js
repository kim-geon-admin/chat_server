
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
    this.setLoginUser(request.query.id,'Y');

    if(user.dataValues.user_id != ''){
        session.loginSession(request,response);
        response.send('success');
      }else response.send('fail');

  }).catch((error)=>{logger.error(error)});
  
  }


  exports.setLoginUser = function(id,loginTp){ 
    
    Master.update(
      //update할 칼럼 정보
      {
       is_login : loginTp
      },
      //where절 
      {
       where : { user_id : id}
      })
    .then((user) => {
   
  
    }).catch((error)=>{logger.error(error)});
    
    }