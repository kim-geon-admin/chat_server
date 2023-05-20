const express = require('express');
const router = express.Router();

//router info
const userInfo = require('./loginProcess.js');
const friendInfo = require('./friendProcess.js');
const chatInfo = require('./chatProcess.js');


//const chat = require('./chat.js');

//router.use('/chat', chat);
router.use('/logIn', userInfo);
router.use('/friend', friendInfo);
router.use('/chat', chatInfo);


module.exports = router;