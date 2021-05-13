// đại diện cho các bài đăng
const mongoose = require('mongoose')
const postchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    toGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'GroupUser'},
    title: {type: String, required: true},
    content: {type: String, default: 'Nothing to write :)) !'},
    mediaContent: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true}],
    typePost: {type: String, default: 'text'},
    timeStamp: {type: Date, default: Date.now()},
})
const Post = mongoose.model('Post', postchema)

module.exports = Post