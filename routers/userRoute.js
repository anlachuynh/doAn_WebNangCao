const router = require("express").Router()
const {index, isLogin, flashData, checkValid, logout, index_register, register} = require('../controllers/UserController')
const {local_authenticate} = require('../controllers/Authentication')
const {validator_login, validator_register} = require('../controllers/validator')

router.get('/login', isLogin, index)

router.post('/login', flashData, validator_login, checkValid, local_authenticate)

router.get('/logout', logout)

// router.get('/register', isLogin, index_register)

// router.post('/register', flashData, validator_register, checkValid, register)

module.exports = router