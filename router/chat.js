const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const executeQueryData = require('../postgresql/chatData');

app.use(cors({
  origin: true,
  credentials: true
}));

exports.initConn = function(socket,io){ 
   
    return socket.on('message', (msgObj) => {
      
    
            console.log(`${msgObj.room_id}번 방  ${msgObj.id}님의 메세지 ${msgObj.message}`);
       
            /**
             * 대화방 생성 후 최초 메세지 인지 확인 
             * 최초일 경우 chat020 detail 데이터 생성 
             */
            executeQueryData.selectChatDetailRoom(msgObj);


            //일반 전체 메세지 보내기
            //io.emit('message', (msgObj.message))
            
            //특정방 사용자에게만 보내기
             io.to(msgObj.room_id).emit( 'message', msgObj);
    
  })
      
      // server.listen(40001, function() {
      //   console.log('listening on port 4000');
      // })

}

