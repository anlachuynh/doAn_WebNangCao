const {check, validationResult} = require('express-validator')
const model = require('../models/userModel')
const passport = require('passport')

const notify = (req, res, uri, {code, error} )=>{
    req.flash('code', code || '')
    req.flash('error', error || '')
    return res.redirect(uri)
}
module.exports = {
    index: (req, res) => {
        return res.render('thongbao')
    },
    flashData: (req, res, next) => {
        let {name, email} = req.body
        req.flash('email', email || '')
        req.flash('name', name || '')
        next()
    },
    

    
}