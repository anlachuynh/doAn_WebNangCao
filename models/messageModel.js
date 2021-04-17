const mongoose = require('mongoose')
const messSchema = mongoose.Schema({
    fromID: {type: String, required: true},
    toID: {type: String, required: true},
    content: {type: String, default: ''},
    timeStamp: {type: Date, default: Date.now()},
    typeMess: {type: String, default: 'text'}
})
const Message = mongoose.model('Message', messSchema)

module.exports = Message