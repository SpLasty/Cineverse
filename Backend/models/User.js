const mongoose = require('mongoose');
const validator = require('validator')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
       

    },

    password: {
        type: String,
        
    },
    avatar: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('users', UserSchema);