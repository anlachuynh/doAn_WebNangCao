const model = require('../models/userModel')
const passport = require('passport')

module.exports = {
    google_callback: passport.authenticate('google', {
        failureRedirect: '/user/login',
        successRedirect: '/',
        failureFlash: true
    }),
    google_authenticate: passport.authenticate('google', {
        scope: ['profile', 'email']
    })
}