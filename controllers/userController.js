const {check, validationResult} = require('express-validator')
const model = require('../models/userModel')
const passport = require('passport')

const notify = (req, res, uri, {code, error} )=>{
    req.flash('code', code || '')
    req.flash('error', error || '')
    return res.redirect(uri)
}
module.exports = {
    flashData: (req, res, next) => {
        let {name, email} = req.body
        req.flash('email', email || '')
        req.flash('name', name || '')
        next()
    },
    index: (req, res) => {
        let error = req.flash('error') || ''
        let code = req.flash('code')
        if(code.length == 0 && error.length > 0) code = -1
        let email = req.flash('email') || ''
        console.log(code)
        res.render('login', {code, error, email})
    },
    logout: (req, res) =>{
        req.logout()
        res.redirect('/')
    },
    isLogin: (req, res, next) => {
        if(req.isAuthenticated()) return res.redirect('/')
        else return next()
    },
    index_register: (req, res) =>{
        let error = req.flash('error') || ''
        let code = req.flash('code') || ((error.length > 0) ? -1: 0)
        let email = req.flash('email') || ''
        let name = req.flash('name') || ''
        res.render('register', {code, error, email, name})
    },
    register: async (req, res) => {
        const {name, email, password} = req.body
        await model.findOne({email: email}).exec()
        .then(existU => {
            if(existU == null)
                new model({name, email, password}).save(err => {
                    if(err) return notify(req, res, '/user/register', {code: 1, error: err._message})
                    else return notify(req, res, '/user/login', {code: 0, error: 'Đăng ký thành công!'})
                })
            else return notify(req, res, '/user/register', {code: 2, error: 'Đã tồn tại email người dùng!'})
        })
        .catch(error => {
            return notify(req, res, '/user/register', {code: 5, error: error.toString()})
        })
    },
    checkValid: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0) {
            req.flash('code', 3)
            req.flash('error', result.errors.shift().msg)
            return res.redirect('back')
        }
        else next()
    }
}