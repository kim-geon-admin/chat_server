const app = require('express')();
const bodyParser = require('body-parser');
const middleRouter = require('./router/middleRouter');
const cors = require('cors');
const ws = require('./router/chat');
const server = require('http').createServer(app);
require("dotenv").config();

var sequelize = require('./sequelize/seqConnection.js');
//logger
const logger = require('./logger');

//redis
const redisClient = require('./redis/redisConnection');
const session = require('./session/sessionInit');

//server-push
const pushProcess = require('./router/alarmInit');

//redis 연결
session.init(app,redisClient);


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(bodyParser.json());

app.use('/api', middleRouter);

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

//소켓 초기화
ws.init(io);

//sse 초기화
pushProcess(server);

server.listen(4000, function() {
  //console.log('listening on port 4000');
  logger.info('listening on port 4000');
})
 