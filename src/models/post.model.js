const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    content: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    photos:
    {
        type: String,
        required: false
    }

});
const Post = mongoose.model('Post', postSchema);

module.exports = Post