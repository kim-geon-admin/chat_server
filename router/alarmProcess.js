const express = require('express');
const router = express.Router();

//const executeQueryData = require('../postgresql/loginData'); 기존 쿼리방식
const executeQueryData = require('../sequelize/dao/seqLoginData'); //ORM


const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




router.get('/chat', function(req, res, next) {

    res
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Content-Type", "text/event-stream")
    .setHeader("Connection", "keep-alive")
    .setHeader("Cache-Control", "no-cache")
    
  
    setInterval(() => {
        res
            .status(200)
            .write(
                'event: red\n'+
                'data: {"message" : "hello "}\n\n'
            );
    }, 2000);

})

module.exports = router;
