require("dotenv").config();
const redis = require('redis');
const redisInfo = {
  host : process.env.REDIS_HOST,
  port : process.env.REDIS_PORT,
  db : process.env.REDIS_DB_SEQ // Redis에서 사용하는 DB 번호
 // password : '1234asdf'
// legacyMode: true //redis v4 이상에서 v3버젼의 문법을 쓰려면 필요
}

const logger = require('../logger');

//const pubClient = redis.createClient(redisInfo);
//const subClient = redis.createClient(redisInfo);


  module.exports = class {
    constructor() {
      this.pubClient = redis.createClient(redisInfo)
      this.pubClient.connect().then();
      this.subClient = redis.createClient(redisInfo)
      this.subClient.connect().then();
    }
  

    //event listener 등록
    on(event, callback) {
      this.subClient.on(event, callback);
    }

    
    //채널에 메세지 전송
     publish(channel, msgObj) {
      let message = JSON.stringify(msgObj);
      try{
          this.pubClient.publish(channel+'', message);
          console.log('대 성공',message);
      }catch(e) {console.log('[publish]',e);}
      
    
    }
    //채널 구독
   async subscribe(channel,io) {
        console.log('채널 구독준비',channel);
        //this.unsubscribe(channel+'');
       await this.subClient.unsubscribe(channel+'');
       await this.subClient.subscribe(channel+'', (message) => {
          console.log('채널 탄다111 ');
        //  console.log('message : ', message);
          console.log('채널 탄다 ');
           let msgObj =   JSON.parse(message)
           io.to(msgObj.room_id).emit( 'message',msgObj);

        });
     // this.subClient.subscribe(channel+'');
    }
    //채널 구독 취소
    unsubscribe(channel) {
      this.subClient.unsubscribe(channel);
    }

    // read(channel, message) {
    //   this.subClient.on('message', callback) {
     
    //   }
    // }
}