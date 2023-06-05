const express = require('express');
const router = express.Router();
//const executeQueryData = require('../postgresql/friendData');기존 쿼리방식
const executeQueryData = require('../sequelize/dao/seqFriendData'); //ORM

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* GET home page. */
router.get('/getFriendList', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  console.log('friendData js 수행 됩니다', req.body,req.query);
  let param = req.query;


  
  executeQueryData.selectFriend(req,res);


});




module.exports = router;
