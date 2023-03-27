const express = require('express');
const router = express.Router();
const Chat = require('../../models/chat.model');

router.get('/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
    const chat = await Chat.findOne({ users: { $all: [senderId, receiverId] } }).populate('messages.sender messages.receiver', 'username');
    res.json(chat);
});

module.exports = router;