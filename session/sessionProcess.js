const express = require('express')();
const redisClient = require('../redis/redisConnection');




exports.loginSession = function(req,res){ 

   /**
    * req.session 에 넣는 거 자체만으로도
    * redis에 담긴다
    */
   // console.log(req.session);
    req.session.key = req.query.id;
    req.session.name = req.query.id;
   // redisClient.set('_'+req.query.id,req.session.key);
    console.log('session 발급 완료');
   
  }

  exports.chkSession =async function(req,res,next){ 

    
    //세션인증완료
    if(req.session.key){
      console.log('session key 인증완료',req.session.key);
 
      next();
    }else{
      console.log('session 인증실패',req.session.key);
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Credentials", true);
      // res.header("Access-Control-Allow-Headers", 'X-Requested-With,content-type');
      // res.redirect('http://localhost:3000/');
    // res.send({auth_session:false})
    res.status(302).send({auth_session:false});

    }
    
//     app.get('/logout', function (req, res) {
//   res.contentType('json');
//   store.destroy(req.sessionID, function () {
//     req.session.destroy(function () {
//       res.clearCookie(sessionOpts.key, { path: '/' });
//       res.send({ success: true });
//     });
//   });
// });

   
  }