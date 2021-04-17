const userModel = require('../models/userModel')
const messModel = require('../models/messageModel')
const usersOnline = require('../socket').usersOnline
module.exports = {
    isLogin: (req, res, next) => {
        if(!req.isAuthenticated()) return res.redirect('/')
        else return next()
        // if (!req.session.isLogin) return res.redirect('/user/login')
        // else next()
    },
    index: async (req, res) => {
        let user = req.user
        let allUsers = await userModel.find({}, 'name nickName avatar email').exec()
        allUsers = allUsers.filter(f => !f._id.equals(user._id))
        allUsers.forEach(e => e.status = usersOnline.hasOwnProperty(e._id) ? 'online' : 'offline')
        res.render('chat', {user, other: '', allUsers})
    },
    chat: async (req, res) => {
        // lay tat ca thong tin tu user
        let user = req.user
        let allUsers = await userModel.find({}, 'name nickName avatar email').exec() // nen cap nhat sau 1 khoang thoi gian de toi uu he thong
        allUsers = allUsers.filter(f => !f._id.equals(user._id))
        allUsers.forEach(e => e.status = usersOnline.hasOwnProperty(e._id) ? 'online' : 'offline')

        // lay thong tin cua nguoi chat hien tai
        let id = req.params.id
        let other = allUsers.filter(f => f._id == id)[0]

        // cac thuoc tinh css bo sung vao tin nhan
        let attrCss = {you: {classPeople: 'you', classSide: 'entete ten-ben-aside', classStatus: 'status green'},
                        me: {classPeople: 'me', classSide: 'entete', classStatus: 'status blue'}}

        // lay ra tat ca cac tin nhan
        let mess1 = await messModel.find({fromID: user._id, toID: req.params.id}, 'content timeStamp').exec()
        let mess2 = await messModel.find({fromID: req.params.id, toID: user._id}, 'content timeStamp').exec()
        mess1.forEach(e => e.classCss = attrCss.me)
        mess2.forEach(e => e.classCss = attrCss.you)

        // sap xep tin nhan theo thu tu
        let allMess = [...mess1, ...mess2]
        allMess.sort((f1, f2) => f1.timeStamp.getTime() - f2.timeStamp.getTime())

        // doi thuoc tinh thoi gian de hien thi
        allMess.forEach(e => {
            if(e.timeStamp.toLocaleDateString() == new Date(Date.now()).toLocaleDateString())
                e.time = e.timeStamp.toLocaleTimeString()
            else
                e.time = e.timeStamp.toLocaleString()
        })
        res.render('chat', {user, other, allUsers, allMess})
    }
}