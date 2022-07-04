const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    pfp: {
        type: String,
        required: true,
    },
    posts: {
        type: Array,
    },
    date: {
        type: String,
        default: new Date,
    },
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users;