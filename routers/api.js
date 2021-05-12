const router = require("express").Router()
const request = require('../controllers/ApiController')
const {isLogin_json, checkToken} = require('../methods')
const multer = require('multer')
const uploader = multer({dest: __dirname + '/../temp/'})
const {validCreatePost, validGetPost, validToken, validCreateComment} = require('../controllers/validator')

router.post('/post/create', isLogin_json, uploader.array('image'), validCreatePost, request.checkValid, checkToken, request.Post.create)

router.post('/comment/create', isLogin_json, uploader.array('image'), validCreateComment, request.checkValid, checkToken, request.Comment.create)

router.post('/post/get_posts', isLogin_json, validGetPost, request.checkValid, checkToken, request.Post.get)

router.post('/post/get_all_posts', isLogin_json, validToken, request.checkValid, checkToken, request.Post.getAll)

router.post('/post/:postID', isLogin_json, validToken, request.checkValid, checkToken, request.Post.getById)

router.post('/post/:postID/get_comments', isLogin_json, validToken, request.checkValid, checkToken, request.Comment.getComment)

module.exports = router


// điều chỉnh,cấu hình  api