const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
        },
    ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;