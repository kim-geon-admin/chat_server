const express = require('express');
const router = express.Router();

//router info
const userInfo = require('./loginProcess.js');
const friendInfo = require('./friendProcess.js');
const chatInfo = require('./chatProcess.js');

//session
const session = require('../session/sessionProcess.js');


//const chat = require('./chat.js');

//router.use('/chat', chat);
router.use('/logIn', userInfo);
router.use('/friend',session.chkSession ,friendInfo);
router.use('/chat',session.chkSession, chatInfo);



module.exports = router;