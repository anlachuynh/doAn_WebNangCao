const router = require("express").Router()
const {createAccountIndex, createAccount, isLogin, checkValid} = require('../controllers/adminController')
const {checkToken} = require('../methods')
const {validator_register} = require('../controllers/validator')

router.get('/createAccount', isLogin, createAccountIndex)

router.post('/createAccount', isLogin, validator_register, checkValid, checkToken, createAccount)


module.exports = router