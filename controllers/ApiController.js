const {check, validationResult} = require('express-validator')
const Comment = require('../models/commentModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const Group = require('../models/groupUserModel')
const MediaContent = require('../models/mediaModel')
const passport = require('passport')
const flash = require('express-flash')
const { json } = require('express')

const notify = (req, res, uri, {code, error} )=>{
    req.flash('code', code || '')
    req.flash('error', error || '')
    return res.redirect(uri)
}
const getFlashData = (req) => {
    let error = req.flash('error')
    let toGroup = req.flash('toGroup')
    return {error, toGroup}
}
const getGroup = async (group) => {
    return Group.findById(group).exec()
    .then(toGroup => {
        if(toGroup == null) return {error:'Không thể tìm thấy thông tin nhóm', toGroup:[]}
        else return {error:'', toGroup}
    })
    .catch(error => ({error, toGroup: []}))
}
const getImage = (req) => {
    if (req.files != undefined && req.files.length >= 0){
        let imageArr = req.files.map(e => ({originalname: e.originalname, uri: e.path}))
        return MediaContent.insertMany(imageArr)
        .then(image => ({error:'', image}))
        .catch(error => ({error, image:[]}))
    }
    else {
        console.log('Không tìm thấy ảnh')
        return {error: '', image: []}
    } 
}
const getVideo = (video) => {
    if (Array.isArray(video) && video.length >= 0){
        let videoArr = video.map(e => ({uri: e}))
        return MediaContent.insertMany(videoArr)
        .then(videos => ({error:'', videos}))
        .catch(error => ({error, videos:[]}))
    }
    else {
        console.log('Không tìm thấy video')
        return {error:'', videos: []}
    }
}
const getPost = async (postID) => {
    return Post.findById(postID).exec()
    .then(post => {
        if(post == null) return {error:'Không thể tìm thấy bài đăng', post:[]}
        else return {error:'', post}
    })
    .catch(error => ({error, post: []}))
}
module.exports = {
    Post : {
        create: async (req, res) => {
            let {title, content, group, video} = req.body

            let {error : e1, toGroup} = await getGroup(group)
            let {error : e2, image} = await getImage(req)
            let {error : e3, videos} = await getVideo(video)

            let error = e1 + e2 + e3
            if(error.length > 0) return res.json({success: false, msg: error})
            
            let postItem = new Post({user: req.user, toGroup, title, content, mediaContent: [...image, ...videos]})
            return postItem.save()
            .then((doc) => {
                if (doc == postItem) {
                    console.log('Tạo bài đăng thành công')
                    console.log(doc)
                    return res.json({success: true, msg: 'Tạo bài đăng thành công', doc})
                }
            })
            .catch(err => res.json({success: false, msg: err}))
        },
        //TODO nên giới hạn lại trường dữ liệu vì đây chỉ là dữ liệu cho việc hiển thi item
        get: async (req, res) => {
            let {page, quantity} = req.body

            return Post.find().populate('user toGroup mediaContent').skip((page-1)*quantity).limit((+quantity)).exec()
            .then(docs => res.json({success: true, docs}))
            .catch(err => res.json({success: false, msg: err}))
        },
        getAll: async (req, res) => {
            return Post.find().populate('user toGroup mediaContent', '-password -authID -email -_id').exec()
            .then(docs => res.json({success: true, docs}))
            .catch(err => res.json({success: false, msg: err}))
        },
        getById: async (req, res) => {
            let {postID} = req.params
            if (postID == undefined) return res.json({success: false, msg: 'Không có id'})
            else return Post.findById(postID).populate('user toGroup mediaContent', '-password -authID -email -_id').exec()
            .then(doc => {
                if (doc == null) return res.json({success: false, msg: 'Bài đăng không tồn tại'})
                else return res.json({success: true, doc})
            })
            .catch(err => res.json({success: false, msg: err}))
        }
    },
    Comment: {
        create: async (req, res) => {
            let {content, postID, video} = req.body
            let {error: e1, post} = await getPost(postID)
            let {error: e2, image} = await getImage(req)
            let {error: e3, videos} = await getVideo(video)

            let error = e1 + e2 + e3
            if(error.length > 0) return res.json({success: false, msg: error})
            
            let commentItem = new Comment({user: req.user, post, content, mediaContent: [...image, ...videos]})
            return commentItem.save()
            .then((doc) => {
                if (doc == commentItem) {
                    console.log(`Comment: '${content}' vào bài viết '${post._id}'`)
                    console.log(doc)
                    return res.json({success: true, msg: 'Đã thêm comment thành công', doc})
                }
            })
            .catch(err => res.json({success: false, msg: err}))
        },
        getComment: async (req, res) => {
            let {postID} = req.params
            if (postID == undefined) return res.json({success: false, msg: 'Không có id'})
            let {error, post} = await getPost(postID)
            if(error.length > 0) return res.json({success: false, msg: error})

            return Comment.find({post}).populate('user mediaContent', '-password -authID -email -_id').exec()
            .then(docs => res.json({success: true, docs}))
            .catch(err => res.json({success: false, msg: err}))
        }
    },
    checkValid: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length > 0) res.json({success: false, msg: result.errors.shift().msg})
        else next()
    }
} 