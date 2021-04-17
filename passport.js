const userModel = require('./models/userModel')
const passport = require('passport')
const localStratery = require('passport-local').Strategy
passport.use('local', new localStratery({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
},async (req, email, password, done) => {
    console.log('Authenticating ...')
    await userModel.findOne({email}).exec()
    .then(u => {
        if(u != null)
            u.comparePass(password, (err, isMatch)=>{
                if (err) return done(null, false, err)
                else if(isMatch) return done(null, u)
                else return done(null, false, {message: 'Sai mật khẩu!'})
            })
        else return done(null, false, {message: 'Không tìm thấy thông tin tài khoản!'})
    })
    .catch(err => {
        console.log('Error: ' + err)
        return done(null, false, err)
    })
}))
    

// done(err) will be handled by Express and generate an HTTP 500 response
// done(null, false) call failureRedirect
// done(null, user) call successRedirect

// In case of an invalid authentication (but not an internal error)
// done(null, false, { message : 'invalid e-mail address or password' });

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => done(err, user))
})

module.exports = passport
