const router = require("express").Router()
const {index, isLogin, flashData, checkValid, logout} = require('../controllers/UserController')
const {deleteUser} = require('../controllers/ApiController')
const {local_authenticate} = require('../controllers/Authentication')
const {validator_login, validToken} = require('../controllers/validator')
const {checkToken, isLogin: checkLogin} = require('../methods')

router.get('/login', isLogin, index)

router.post('/login', flashData, validator_login, checkValid, local_authenticate)

router.get('/logout', logout)

router.post('/delete', checkLogin, validToken, checkValid, checkToken, deleteUser)

module.exports = router