const router = require("express").Router()
const controller = require('../controllers/Notification')

router.get('/', controller.index)

module.exports = router


// điều chỉnh,cấu hình  api