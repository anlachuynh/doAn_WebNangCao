const messModel = require('./models/messageModel')
let usersOnline = {}
// Cấu hình socket
const configSocket = (app) => {
    const server = require('http').createServer(app);
    // Gán socket vào server của ứng dụng
    const io = require('socket.io')(server);

    // Handle client mới (khi người dùng kết nối)
    io.on('connection', (socket) => {
        const _sessionID = socket.id
        let userID
        socket.on('setUser', (_userID)=>{
            // Lưu thông tin người dùng đang online
            userID = _userID
            usersOnline[userID] = _sessionID

            // Cập nhật trạng thái online cho người dùng khác
            io.emit('updateStatus', usersOnline)
            console.log(`người dùng: ${userID} online`)
        })
        // Nhận tin nhắn
        socket.on('sendMess', function({mess, otherID}){

            // Tạo thời gian
            let time_mess = new Date(Date.now())

            // Lưu nội dung tin nhắn vào database
            new messModel({fromID: userID, toID: otherID, content: mess, timeStamp: time_mess}).save()
            console.log('gui tin nhan den id: '+ otherID)

            // Chuyển tiếp tin nhắn cho người dùng kia
            if (usersOnline[otherID]){
                io.to(usersOnline[otherID]).emit('newMess', {mess, time_mess: time_mess.toLocaleTimeString()})
            }
            else{
                console.log(`nguoi dung ${otherID} offline`)
            }
        })
        // Nhận được thông tin ngắt kết nối, cập nhật lại danh sách người dùng online
        socket.on('disconnect', ()=>{
            console.log('got disconnect')
            delete usersOnline[userID]
            io.emit('updateStatus', usersOnline)
        })
        
    })
    return server
}

module.exports = {configSocket, usersOnline}

// socket cung cấp 2 methods chính là .on và .emit, trong đó:
// .on('event', callback): để lắng nghe sự kiện 'event' và trả về callback
// .emit('event', data): để gủi đi sự kiện 'event' và data

// khi nhận được sự kiện, data sẽ được đưa vào callback để xử lý

// Có 2 sự kiện chính luôn được gọi khi kết nối đến client là 'connection' và 'disconnect'
// Khi handle 'connection', data sẽ là socket riêng đến một client đã kết nối
// Khi handle 'disconnect' báo hiệu người dùng đã ngắt kết nối khỏi socket
