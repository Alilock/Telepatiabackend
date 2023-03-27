const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false }
    }],
});

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat