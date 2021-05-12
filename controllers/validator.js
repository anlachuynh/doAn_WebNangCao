const {check, validationResult} = require('express-validator')

const validToken = check('token').exists().withMessage('Không tìm thấy token').notEmpty().withMessage('Mã token không hợp lệ')

module.exports = {
    validToken,

    validCreatePost: [
        validToken,
        check('title').exists().withMessage('Không tìm thấy tiêu đề')
        .notEmpty().withMessage('Tiêu để bài viết không được để trống'),
    
        check('content').exists().withMessage('Không tìm thấy nội dung bài viết')
        .notEmpty().withMessage('Nội dung bài viết không được để trống')
        .isLength({min: 3}).withMessage('Nội dung phải có tối thiểu 3 ký tự'),
        
        check('group').exists().withMessage('Không tìm thấy nhóm chỉ định')
        .notEmpty().withMessage('Id nhóm không được để trống'),
    ],
    validGetPost: [
        validToken,
        check('page').exists().withMessage('Không tìm thấy số trang')
        .notEmpty().withMessage('Số trang không được để trống')
        .isInt().withMessage('Số trang không phải số nguyên'),
    
        check('quantity').default(10)
        .isInt().withMessage('Quantity không phải số nguyển')
    ],
    validCreateComment: [
        validToken,
        check('postID').exists().withMessage('Không tìm id bài viết')
        .notEmpty().withMessage('Id bài viết không được để trống'),

        check('content').exists().withMessage('Không tìm thấy nội dung comment')
        .notEmpty().withMessage('Nội dung comment không được để trống')
        .isLength({min: 3}).withMessage('Nội dung phải có tối thiểu 3 ký tự'),
    ]
}