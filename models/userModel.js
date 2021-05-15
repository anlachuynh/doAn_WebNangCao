const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    authID: {type: String, default: ''},
    name: {type: String, default: 'anonymous'},
    nickName: {type: String, default: ''},
    email: {type: String, required: true, unique: true},
    password: {type: String, default: ''},
    avatar: {type: String, default: '/images/default.png'},
    role: {type: String, default: 'student'},
})

userSchema.path('name').set(function (value) {
    return value.replace(/^\w|\s\w/gi, match => match.toUpperCase())
})

userSchema.path('role').set(function (value) {
    return value.replace(/^\w|\s\w/gi, match => match.toUpperCase())
})

userSchema.pre('save', function (next) {
    let user = this
    user.nickName = user.name
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(!err){
            user.password = hash
            next()
        }
        else{
            console.log('Lỗi hash mật khẩu: ' + err)
        }
    })
})
const Group = require('../models/groupUserModel')
userSchema.pre('deleteOne', async function (next, doc) {
    let id = mongoose.Types.ObjectId(this._conditions._id)
    return Group.updateMany({leader: id}, {leader: null}).exec()
    .then(result => {
        console.log('Đã trả lại vị trí leader')
        console.log(result)
    })
})

userSchema.methods.comparePass = function(planePassword, callback) {
    bcrypt.compare(planePassword, this.password, (err, isMatch) => {
        if (err) return callback(err)
        callback(err, isMatch)
    })
}

const Users = mongoose.model('User', userSchema)


module.exports = Users