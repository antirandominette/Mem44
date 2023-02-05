const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    resume: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: { type: [String], required: true, default: [] },
    usersDisliked: { type: [String], required: true, default: [] },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);