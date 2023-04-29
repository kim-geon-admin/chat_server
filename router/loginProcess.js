const express = require('express');
const router = express.Router();
const executeQueryData = require('../postgresql/loginData');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* GET home page. */
router.get('/getLoginInfo', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  console.log('getLoginInfo js 수행 됩니다', req.body,req.query);
  let param = req.query;

  // if('master' == param.id && '1234' == param.password){
  //   res.send('sucess');  
  // }else if('master2' == param.id && '1234' == param.password){
  //   res.send('sucess');  
  // }else{
  //   res.send('fail');  
  // }
  
  executeQueryData.selectUser(req,res);


});




module.exports = router;
