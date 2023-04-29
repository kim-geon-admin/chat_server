const express = require('express');
const router = express.Router();

//router info
const userInfo = require('./loginProcess.js');
//const chat = require('./chat.js');

//router.use('/chat', chat);
router.use('/logIn', userInfo);



module.exports = router;