const router = require("express").Router()
const controller = require('../controllers/chatController')

router.get('/', controller.isLogin, controller.index)

router.get('/:id', controller.isLogin, controller.chat)

module.exports = router