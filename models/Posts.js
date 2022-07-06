const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    file: {
        type: String,
    },
    caption: {
        type: String,
    },
    username: {
        type: String,
    },
    userpfp: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    date: {
        type: String,
        default: new Date,
    },
})

const Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts;