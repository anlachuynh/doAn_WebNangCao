// Cấu hình admin nếu chưa tồn tại
const userModel = require('./models/userModel')
userModel.find({name: 'Admin', role: 'Admin'}).exec()
.then(u =>{
    if(u.length == 0){
        let name = 'Admin'
        let password = 'admin123'
        let role = 'Admin'
        let email = 'admin@email.com'
        return new userModel({name, password, role, email})
    }
    else throw 'Admin đã được tạo'
})
.then(u => u.save((err, new_u) => {
    if(err) throw err
    if(new_u == u){
        console.log('Tạo mới tài khoản Admin thành công !')
    }
}))
.catch(err => {
    console.log(err)
})

// Thêm các phòng ban nếu chưa tồn tại
const groupUserModel = require('./models/groupUserModel')
groupUserModel.find().exec()
.then(u => {
    if (u.length == 0){
        let allGroup = [
            {name: 'other'},
            {name: 'Phòng Công tác học sinh sinh viên (CTHSSV)'},
            {name: 'Phòng Đại học'},
            {name: 'Phòng Sau đại học'},
            {name: 'Phòng điện toán và máy tính'},
            {name: 'Phòng khảo thí và kiểm định chất lượng'},
            {name: 'Phòng tài chính'},
            {name: 'TDT Creative Language Center'},
            {name: 'Trung tâm tin học'},
            {name: 'Trung tâm đào tạo phát triển xã hội (SDTC)'},
            {name: 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)'},
            {name: 'Trung tâm hợp tác doanh nghiệp và cựu sinh viên'},
            {name: 'Khoa Luật'},
            {name: 'Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa'},
            {name: 'Viện chính sách kinh tế và kinh doanh'},
            {name: 'Khoa Mỹ thuật công nghiệp'},
            {name: 'Khoa Điện – Điện tử'},
            {name: 'Khoa Công nghệ thông tin'},
            {name: 'Khoa Quản trị kinh doanh'},
            {name: 'Khoa Môi trường và bảo hộ lao động'},
            {name: 'Khoa Lao động công đoàn'},
            {name: 'Khoa Tài chính ngân hàng'},
            {name: 'Khoa giáo dục quốc tế'},
        ]
        groupUserModel.insertMany(allGroup, (err, docs) => {
            if(err) throw err
            if(allGroup.length == docs.length){
                console.log(docs)
                console.log('Tạo mới nhóm thành công !')
            }
        })
    }
})
.catch(err => {
    console.log(err)
})


