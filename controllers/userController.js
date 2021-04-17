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
    login: async (req, res) => {
        console.log('login that bai')
        // const {email, password} = req.body
        // res.redirect('/')
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
    validator_login: [
        check('email').exists().withMessage('Vui lòng nhập Email người dùng')
        .notEmpty().withMessage('Không được để trống Email')
        .isEmail().withMessage('Email không đúng định dạng'),
    
        check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được để trống mật khẩu')
        .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự')
    ],
    validator_register: [
        check('name').exists().withMessage('Vui lòng nhập tên người dùng')
        .notEmpty().withMessage('Không được để trống tên người dùng'),

        check('email').exists().withMessage('Vui lòng nhập Email người dùng')
        .notEmpty().withMessage('Không được để trống Email')
        .isEmail().withMessage('Email không đúng định dạng'),
    
        check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được để trống mật khẩu')
        .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),

        check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
        .notEmpty().withMessage('Chưa nhập xác nhận mật khẩu')
        .custom((value, {req}) => {
            if (req.body.password !== value){
                throw new Error('Mật khẩu không khớp')
            }else
                return true
        }),
    ],
    authenticate: passport.authenticate('local', {
        failureRedirect: '/user/login',
        successRedirect: '/',
        failureFlash: true,
        // failureMessage: true
    }),
    valid_login: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0){
            result = result.mapped()
            let message;
            for (fields in result){
                message = result[fields].msg
                break
            }
            return notify(req, res, '/user/login', {code: 3, error: message})
        }
        else next()
    },
    valid_register: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0){
            result = result.mapped()
            let message;
            for (fields in result){
                message = result[fields].msg
                break
            }
            return notify(req, res, '/user/register', {code: 3, error: message})
        }
        else next()
    },
}