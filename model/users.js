const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title:{
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    picture:{
        type:String
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;