//const app = require('express')();
//redis

const session = require('express-session');
const RedisStore = require('connect-redis').default;


exports.init = function(app,redisClient){ 

 app.use(
  session({
    secret:'chat',
    cookie:{ expires : 500000},
    //redis server config
    store : new RedisStore({ 
      client:redisClient,
      ttl:500000 ,//redis 삭제 시간
      prefix:'session',
    }),
    saveUninitialized: false,
    resave : false
  }));
}

