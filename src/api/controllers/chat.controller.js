const Chat = require('../../models/chat.model');

const mongoose = require('mongoose');
const chatController = {
    get: async (req, res, next) => {
        try {
            const { senderId, receiverId } = req.params;
            const chatDb = await Chat.findOne({ users: { $all: [senderId, receiverId] } })
                .populate('messages.sender messages.receiver', 'username profilePicture');
            res.json(chatDb);
        } catch (error) {
            console.log(error);
            next(error)
        }
    },
    getChatId: async (req, res, next) => {
        try {
            const { userId } = req.params;

            // Check if the userId parameter is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid userId' });
            }

            // Find all chats that the user is a part of
            const chats = await Chat.find({ users: { _id: userId } }).populate('users', 'username profilePicture').slice("messages", -1);
            // Filter the chats to get the last unread message for each user


            // const users = new Set();
            // for (const chat of chats) {
            //     const otherUser = chat.users.find(user => user._id.toString() !== userId);
            //     const lastMessage = chat.messages[chat.messages.length - 1];
            //     if (lastMessage.receiver.toString() === userId && !lastMessage.isRead && !users.has(otherUser._id.toString())) {
            //         lastUnreadMessages.push({
            //             user: otherUser,
            //             message: lastMessage
            //         });
            //         users.add(otherUser._id.toString());
            //     }
            // }

            res.json(chats);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = chatController