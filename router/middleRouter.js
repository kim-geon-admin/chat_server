const express = require('express');
const router = express.Router();

//router info
const userInfo = require('./loginProcess.js');
const friendInfo = require('./friendProcess.js');
//const chat = require('./chat.js');

//router.use('/chat', chat);
router.use('/logIn', userInfo);
router.use('/friend', friendInfo);


module.exports = router;