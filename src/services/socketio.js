const Chat = require('../models/chat.model');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined`);
        });

        socket.on('leave', (userId) => {
            socket.leave(userId);
            console.log(`User ${userId} left`);
        });

        socket.on('message', async ({ senderId, receiverId, content }) => {
            let chat = await Chat.findOne({ users: { $all: [senderId, receiverId] } }).populate('messages.sender messages.receiver', 'username');

            if (!chat) {
                chat = await Chat.create({ users: [senderId, receiverId], messages: [{ sender: senderId, receiver: receiverId, content }] });
            } else {
                chat = await Chat.findOneAndUpdate(
                    { users: { $all: [senderId, receiverId] } },
                    { $push: { messages: { sender: senderId, receiver: receiverId, content } } },
                    { new: true }
                ).populate('messages.sender messages.receiver', 'username');
            }

            io.to(receiverId).emit('message', chat);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};