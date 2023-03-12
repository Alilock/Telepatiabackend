const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  confirmCode: {
    type: Number,
    required: true,
  },
  confirmCodeExpDate: {
    type: Date,
    required: true,
  },
  isConfirm: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
