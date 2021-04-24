const router = require("express").Router()
const controller = require('../controllers/Authentication')

router.get('/google/', controller.google_authenticate)

router.get('/google/callback', controller.google_callback)

module.exports = router