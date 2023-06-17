const express = require('express');
const router = express.Router();


//session
const session = require('../session/sessionProcess.js');
try{
    //router info
    const userInfo = require('./loginProcess.js');
    const friendInfo = require('./friendProcess.js');
    const chatInfo = require('./chatProcess.js');
    const exitInfo = require('./exitProcess.js');

        //router.use('/chat', chat);
    router.use('/logIn', userInfo);
    router.use('/friend',session.chkSession ,friendInfo);
    router.use('/chat',session.chkSession, chatInfo);
    router.use('/exit', exitInfo);
}catch(e){
    console.log(e);
}




module.exports = router;