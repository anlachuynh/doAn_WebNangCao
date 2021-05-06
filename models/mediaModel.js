// Đại diện các tệp đa phương tiện
const mongoose = require('mongoose')
const MediaSchema = mongoose.Schema({
    content: {type: String, required: true},
    type: {type: String, required: true, default: 'image'},
    timeStamp: {type: Date, default: Date.now()},
})
const Media = mongoose.model('Media', MediaSchema)

module.exports = Media