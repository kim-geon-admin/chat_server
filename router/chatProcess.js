const express = require('express');
const router = express.Router();
// const executeQueryData = require('../postgresql/chatData'); 기존 쿼리방식
const executeQueryData = require('../sequelize/dao/seqChatData');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* GET home page. */
router.get('/getChatInfo', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  console.log('chatProcess select 수행 됩니다', req.body,req.query);

  executeQueryData.selectChatRomm(req,res);
  
 
 // if(! rtnCode) next();
  

});




router.get('/getChatListInfo', function(req, res, next) {
  //console.log('2',res);

  console.log('getChatListInfo  select 수행 됩니다', req.body,req.query);
  let param = req.query;

  executeQueryData.selectChatList(req,res);


});

router.get('/getDetailContents', function(req, res, next) {
  //console.log('2',res);

  console.log('getDetailContents  select 수행 됩니다');
  executeQueryData.selectDetailContents(req,res);


});


module.exports = router;
