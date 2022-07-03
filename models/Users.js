const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email : {
        type: String,
    },
    pfp: {
        type: String,
    },
    date: {
        type: String,
        default: new Date,
    },
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users;