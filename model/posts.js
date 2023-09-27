const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image:{
        type:String,
    },
    likes:{
        type:Number
    },
    text:{
        type:String
    },
    publishData:{
        type:Date
    },
    userId:{
        type:mongoose.Types.ObjectId
    },
    tags:{
        type:[String]
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;