const app = require('express')()
const bodyParser = require('body-parser');
const middleRouter = require('./router/middleRouter');
const cors = require('cors');
const ws = require('./router/chat');

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});





app.use(cors({
  origin: true,
  credentials: true
}));

app.use(bodyParser.json());



app.use('/api', middleRouter);


// io.on('connection', socket => {
//   socket.on('message', (message) => {
//     console.log(` message ${message}`)
//     io.emit('message', (message))
//   })
// })

// app.listen(4000, function() {
//   console.log('listening on port 4000');
// })


io.on('connection', socket => {

 //방 들어 가기
  socket.on('enter_room', (roomName, done) => {
    console.log('socket.rooms(before): ', socket.rooms); // 소켓이 어떤 방에 있는지 알기위해 출력
    socket.join(roomName); // 방에 참가를 하고
    console.log('socket.rooms(after): ', socket.rooms); // 소켓이 어떤 방에 있는지 알기위해 출력
    setTimeout(() => {
      done('안녕 프론트엔드 ?');
    }, 5000);
  });
  
  
  // socket.on('message', (msgObj) => {
  //   console.log(` message ${msgObj.message}`);
  //   console.log(` roomid ${msgObj.rommId}`)
    
  //   //일반 전체 메세지 보내기
  //   //io.emit('message', (msgObj.message))
    
  //   //특정방 사용자에게만 보내기
  //    io.to(msgObj.rommId).emit( 'message', (msgObj.message));
    
  // })

  ws.initConn(socket,io);
  
})


//  ws.initConn(); 
server.listen(4000, function() {
  console.log('listening on port 40001');
})
