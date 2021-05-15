const router = require("express").Router()
const {google_authenticate, google_callback} = require('../controllers/Authentication')

router.get('/google/', google_authenticate)

router.get('/google/callback', google_callback)

module.exports = router