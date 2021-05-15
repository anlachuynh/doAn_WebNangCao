const {check, validationResult} = require('express-validator')
const User = require('../models/userModel')
module.exports = {
    createAccountIndex: (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')
        let name = req.flash('name')
        let email = req.flash('email')
        let password = req.flash('password')
        let groupID = req.flash('groupID')
        return res.render('createAccount', {data: {...req.session.passport.user, 
            ...req.user._doc}, flash: {success, msg, name, email, password, groupID}})
    },
    createAccount: (req, res) => {
        let {name, email, password, groupID} = req.body
        if(`${groupID}`!='') groupID = [].concat(`${groupID}`)
        else groupID = []
        req.flash('name', name)
        req.flash('email', email)
        req.flash('password', password)
        req.flash('groupID', groupID)
        console.log(groupID)
        res.redirect('back')
        // new User({name, email, password, group: groupID}).save()
    },
    checkValid: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0) {
            req.flash('success', false)
            req.flash('msg', result.errors.shift().msg)
            res.redirect('back')
        }
        else next()
    },
    isLogin: (req, res, next) => {
        if(!req.isAuthenticated()) return res.redirect('/user/login')
        else if (req.user.role !== 'Admin') return res.redirect('/')
        else return next()
    },
}