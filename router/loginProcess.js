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

  
  
  executeQueryData.selectUser(req,res);

 

});





module.exports = router;
