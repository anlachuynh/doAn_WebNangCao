const userModel = require('./models/userModel')

// config admin account and other user
userModel.find({name: 'Admin', role: 'Admin'}).exec()
.then(u =>{
    if(length(u) == 0){
        let name = 'Admin'
        let password = 'Admin'
        let role = 'Admin'
        return new userModel({name, password, role})
    }
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