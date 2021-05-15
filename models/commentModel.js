// Đại diện cho các khoa và các phòng ban
const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    content: {type: String, required: true},
    mediaContent: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true}],
    timeStamp: {type: Date, default: Date.now()},
})

// const MediaContent =  require('./mediaModel')
// CommentSchema.pre('deleteOne', async function (next){
//     console.log(this._doc)
//     next()
//     // return MediaContent.deleteMany({post: this._conditions._id}).exec()
//     // .then(result => console.log('Đã xóa các comment thành công'))
//     // .catch(err => console.log(`Đã xóa các comment thất bại: ${err.toString()}`))
// })
// CommentSchema.pre('deleteMany', async function (next){
//     console.log(this)
//     next()
//     // return MediaContent.deleteMany({post: this._conditions._id}).exec()
//     // .then(result => console.log('Đã xóa các comment thành công'))
//     // .catch(err => console.log(`Đã xóa các comment thất bại: ${err.toString()}`))
// })

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment