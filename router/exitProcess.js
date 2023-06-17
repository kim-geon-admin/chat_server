const express = require('express');
const router = express.Router();
// const executeQueryData = require('../postgresql/chatData'); 기존 쿼리방식
const executeQueryData = require('../sequelize/dao/seqChatData');

const app = express();
const bodyParser = require('body-parser');
const logger = require('../logger');
//redis


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const redisClient = require('../redis/redisConnection');

/* GET home page. */
router.get('/room', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  logger.info('exitProcess 수행 됩니다000');
  try{
    logger.info('exitProcess 수행 됩니다111');
  let msgString = await redisClient.get(`room_${req.query.room_id}`,()=>{console.log('redis')});
  logger.info('exitProcess 수행 됩니다222');
  if(msgString != null) {
    let msgSet = {
      msg : msgString,
      fullLength : msgString.length,
      room_id : req.query.room_id,
      id : req.query.id,
      exit: true
    }
    console.log('exitProcess 수행 됩니다',msgSet); //id,room_id
    executeQueryData.selectChat010(msgSet);

  }
 
  res.send('success');
}catch(e){
  logger.error(e);
}

 
});



  module.exports = router;