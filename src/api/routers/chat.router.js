const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.get('/getall/:userId', chatController.getChatId)
router.get('/:senderId/:receiverId', chatController.get)
module.exports = router;