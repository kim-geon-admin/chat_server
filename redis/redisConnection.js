const redis = require('redis');
require("dotenv").config();

const redisInfo = {
  host : process.env.REDIS_HOST,
  port : process.env.REDIS_PORT,
  db : process.env.REDIS_DB_SEQ // Redis에서 사용하는 DB 번호
 // password : '1234asdf'
// legacyMode: true //redis v4 이상에서 v3버젼의 문법을 쓰려면 필요
}

//redis session
 redisClient = redis.createClient(redisInfo);

//this.connection(redisClient);
redisClient.connect().then(()=>console.log('redis 연결 성공'));

module.exports = redisClient;