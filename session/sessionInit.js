//const app = require('express')();
//redis

const session = require('express-session');
const RedisStore = require('connect-redis').default;


exports.init = function(app,redisClient){ 

 app.use(
  session({

    secret:'chat',
    cookie:{ 
      expires : 50000000 //ms세컨드 단위
    },
    //redis server config
    store : new RedisStore({ 
      client:redisClient,
      ttl:50000000 ,//redis 삭제 시간
      prefix:'session',
    }),
    saveUninitialized: true, //session에 아무런 작업이 이루어지지 않은 상황을 말합니다.
    resave : true,
    rolling : true
    /*
   saveUninitialized: false,
    resave : false,
    
    */
  }));
}

