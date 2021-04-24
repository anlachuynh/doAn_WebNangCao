const express = require('express')
const app = express()
app.set('view engine', 'ejs')

require('dotenv').config()

const fs = require('fs')
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cookieParser('51801031'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 10 * 24 * 60 * 60}
}))

const passport = require('./passport')
app.use(passport.initialize())
app.use(passport.session())

const flash = require('express-flash')
app.use(flash())

require('./db')


// xác minh đã đăng nhập và phải có thông tin user trong session
const isLogin = (req, res, next) => {
    if(req.isAuthenticated()) return next()
    else return res.redirect('./user/login')
}

// Dashboard
app.get('/', isLogin, (req, res) => {
    res.redirect('/chat')
})

app.use('/auth', require('./routers/OAuth'))

app.use('/chat', require('./routers/chatRoute'))

app.use('/user', require('./routers/userRoute'))

app.get('/*', (req, res)=>{
    res.render('404_error', {page: req.params[0]})
})

const server = require('./socket').configSocket(app)

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Application running on port: http://localhost:${port} !`))