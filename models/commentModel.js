// Đại diện cho các khoa và các phòng ban
const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    content: {type: String, required: true},
    // include_img: {type: Boolean, default: false},
    image: [{type: String}],
    video: [{type: String}],
    timeStamp: {type: Date, default: Date.now()},
})
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment