const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
//const executeQueryData = require('../postgresql/chatData'); //기존 쿼리방식
const executeQueryData = require('../sequelize/dao/seqChatData');
const redisChannel = require('../redis/redisChannel');

const redisCh = new redisChannel();



app.use(cors({
  origin: true,
  credentials: true
}));



exports.init = function(io){ 
    
io.on('connection', socket => {

  //방 들어 가기
   socket.on('enter_room', (roomName, done) => {
    
     socket.join(roomName); // 방에 참가를 하고
     console.log(`${roomName} 번 방에 입장하였습니다` ); // 소켓이 어떤 방에 있는지 알기위해 출력

    //  redisCh.on('message', function (channel, message) {
    //   console.log('hello');
    //  });
     redisCh.subscribe(roomName,io);
   
     //redisCh.on('message',function(){console.log('니에')});

     done('안녕 프론트엔드 ?');
   });
   
   
   // socket.on('message', (msgObj) => {
   //   console.log(` message ${msgObj.message}`);
   //   console.log(` roomid ${msgObj.rommId}`)
     
   //   //일반 전체 메세지 보내기
   //   //io.emit('message', (msgObj.message))
     
   //   //특정방 사용자에게만 보내기
   //    io.to(msgObj.rommId).emit( 'message', (msgObj.message));
     
   // })
 
   this.initConn(socket,io);
   
 })
 


}


exports.initConn = function(socket,io){ 
   
    return socket.on('message', (msgObj) => {
      
    
            console.log(`${msgObj.room_id}번 방  ${msgObj.id}님의 메세지 ${msgObj.message}`);
       
            /**
             * 대화방 생성 후 최초 메세지 인지 확인 
             * 최초일 경우 chat020 detail 데이터 생성 
             */
          //  executeQueryData.selectChatDetailRoom(msgObj);


           //특정방 사용자에게만 보내기 23-06-24
           //위에서 sbscribe에서 메세지 처리하고 있음
          // io.to(msgObj.room_id).emit( 'message', msgObj);
           
        
           redisCh.publish(msgObj.room_id,msgObj);

           /**
            * message history를 redis 및 rdb에 기록하는 메소드 호출
            */
            executeQueryData.setMsgtoRedis(msgObj);


            //일반 전체 메세지 보내기
            //io.emit('message', (msgObj.message))
            
           
    
  })
      
      // server.listen(40001, function() {
      //   console.log('listening on port 4000');
      // })

}

