const express = require('express')
const app = express()

app.set('view engine', 'ejs')

const cors = require('cors')
app.use(cors())
require('dotenv').config()
require('./db')
require('./init')
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

// xác minh đã đăng nhập và phải có thông tin user trong session
let {isLogin, isLogin_json, checkToken} = require('./methods')
const { notify } = require('./socket')


// Dashboard
app.get('/', isLogin, (req, res) => {
    res.redirect('/main')
})

app.get('/main', isLogin, (req, res) => {
    console.log({...req.session.passport.user, ...req.user._doc})
    res.render('main', req.session.passport.user)
})

app.use('/notification', isLogin, require('./routers/notificationRoute'))

app.get('/dangbai', (req, res) => {
    res.render('dangbai')
})

app.use('/admin', require('./routers/admin'))

app.use('/api', require('./routers/api'))

app.use('/auth', require('./routers/OAuth'))

app.use('/user', require('./routers/userRoute'))

app.get('/testapi', isLogin_json, (req, res) => {
    res.render('testAPI', req.session.passport.user)
})

app.get('/*', (req, res)=>{
    res.render('404_error', {page: req.params[0]})
})

const server = require('./socket').config(app)
const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Application running on port: http://localhost:${port} !`))