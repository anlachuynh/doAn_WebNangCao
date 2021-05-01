// Đại diện cho các khoa và các phòng ban
const mongoose = require('mongoose')
const GUserchema = mongoose.Schema({
    name: {type: String, required: true},
    leader: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    desc: {type: String, default: ''},
    avatar: {type: String, default: '/images/defaultGroup.png'},
})
const GroupUser = mongoose.model('GroupUser', GUserchema)

module.exports = GroupUser