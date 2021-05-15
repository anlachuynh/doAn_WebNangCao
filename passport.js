const userModel = require('./models/userModel')
const passport = require('passport')
const {createToken} = require('./methods')
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

const keys = require('./.git/key')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { refreshToken } = require('./config')
passport.use('google', new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
},(accessToken, refreshToken, profile, done) => {
    if(!profile.id) return done(null, false, {message: 'Không truy cập được id người dùng!'})
    else{
        userModel.findOne({authID: `${profile.provider}:${profile.id}`}).exec()
        .then(u => {
            if (u == null){
                let newUserAuth = new userModel({authID: `${profile.provider}:${profile.id}`, name: `${profile.name.familyName} ${profile.name.givenName}`, nickName: profile.displayName, email: profile.emails[0].value, avatar: profile.photos[0].value})
                newUserAuth.save((err, doc, n) => {
                    if(err) return done(null, false, {message: err})
                    else return done(null, doc)
                })
            }
            else return done(null, u)
        })
    }
}))

// done(err) will be handled by Express and generate an HTTP 500 response
// done(null, false) call failureRedirect
// done(null, user) call successRedirect

// In case of an invalid authentication (but not an internal error)
// done(null, false, { message : 'invalid e-mail address or password' });

passport.serializeUser((user, done) => {
    // tao token
    let {token, refreshToken} = createToken({id: user._id})
    done(null, {id: user._id, token, refreshToken})
})
passport.deserializeUser((_user, done) => {
    userModel.findById(_user.id, (err, user) => done(err, user))
})

module.exports = passport
