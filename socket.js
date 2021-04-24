const messModel = require('./models/messageModel')
let usersOnline = {}
const configSocket = (app) => {
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    // ket noi den 1 client
    io.on('connection', (socket) => {
        const _sessionID = socket.id
        let userID
        socket.on('setUser', (_userID)=>{
            // luu thong tin nguoi dung hien tai
            userID = _userID
            usersOnline[userID] = _sessionID

            // cap nhat trang thai online cho cac nguoi dung khac
            io.emit('updateStatus', usersOnline)
            console.log(`người dùng: ${userID} online`)
        })
        // nhan tin nhan duoc gui di
        socket.on('sendMess', function({mess, otherID}){

            // tao thoi gian tin nhan
            let time_mess = new Date(Date.now())

            // luu thong tin tin nhan vao database
            new messModel({fromID: userID, toID: otherID, content: mess, timeStamp: time_mess}).save()
            console.log('gui tin nhan den id: '+ otherID)

            // gui tin nhan tro lai den nguoi dung
            if (usersOnline[otherID]){
                io.to(usersOnline[otherID]).emit('newMess', {mess, time_mess: time_mess.toLocaleTimeString()})
            }
            else{
                console.log(`nguoi dung ${otherID} offline`)
            }
        })
        socket.on('disconnect', ()=>{
            console.log('got disconnect')
            delete usersOnline[userID]
            io.emit('updateStatus', usersOnline)
        })
        
    })
    return server
}

module.exports = {configSocket, usersOnline}