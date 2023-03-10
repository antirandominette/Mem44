const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    resume: { type: String, required: true },
    duration: { type: Number, required: true },
    files: { type: [String], required: false },
    upvotes: { type: Number, required: true, default: 0 },
    downvotes: { type: Number, required: true, default: 0 },
    usersUpvoted: { type: [String], required: true, default: [] },
    usersDownvoted: { type: [String], required: true, default: [] },
    userId: { type: String, required: true },
    comments: { type: [Object], required: false, default: [] },
});

module.exports = mongoose.model('Post', postSchema);