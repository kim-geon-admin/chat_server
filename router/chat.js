const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')


app.use(cors({
  origin: true,
  credentials: true
}));

exports.initConn = function(socket,io){ 
   
    return socket.on('message', (msgObj) => {

      console.log(msgObj);
            console.log(` message ${msgObj.message}`);
            console.log(` roomid ${msgObj.rommId}`);
    
            //일반 전체 메세지 보내기
            //io.emit('message', (msgObj.message))
            
            //특정방 사용자에게만 보내기
             io.to(msgObj.rommId).emit( 'message', msgObj);
    
  })
      
      // server.listen(40001, function() {
      //   console.log('listening on port 4000');
      // })

}

