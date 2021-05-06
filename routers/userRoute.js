const router = require("express").Router()
const controller = require('../controllers/userController')

router.get('/login', controller.isLogin, controller.index)

router.post('/login', controller.flashData, controller.validator_login, controller.valid_login, controller.local_authenticate)

router.get('/logout', controller.logout)

// router.get('/register', controller.isLogin, controller.index_register)

// router.post('/register', controller.flashData, controller.validator_register, controller.valid_register, controller.register)

module.exports = router