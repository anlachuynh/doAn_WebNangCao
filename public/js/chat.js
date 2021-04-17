const socket = io()

let user = {id, name, nickname} = document.getElementById('userIn4').dataset
socket.on('connect', function (){
    const sessionID = socket.id
    socket.emit('setUser', user.id)

    if(document.getElementById('otherIn4')){
        let other = {id, name, nickname} = document.getElementById('otherIn4').dataset
        socket.on('newMess', function({mess, time_mess}){
            let messdiv = document.createElement('div')
            messdiv.innerHTML = 
                `<li class="you">
                    <div class="entete ten-ben-aside">
                        <span class="status green"></span>
                        <h2>${other.nickname}</h2>
                        <h3>${time_mess}</h3>
                    </div>
                    <div class="message">
                        ${mess}
                    </div>
                </li>`
            document.getElementById('chat').append(messdiv.firstChild)
            pageScroll()
        })
    
        socket.on('updateStatus', (usersOnline) => {
            console.log('da nhan tin hieu cap nhat')
            let status = document.getElementsByClassName('userName')
            Array.prototype.forEach.call(status, e => {
                if (usersOnline.hasOwnProperty(e.dataset.id))
                    e.nextElementSibling.innerHTML = `<span class="status green"></span> online`
                else
                    e.nextElementSibling.innerHTML = `<span class="status orange"></span> offline`
            })
        })
    }
})

function pageScroll() {
    document.getElementById('chat').scrollTo(0, 1000000000)
}

function sendMess(otherID){
    let mess = document.getElementById('message_input').value
    if(mess.length <= 0)
        return
    document.getElementById('message_input').value = ''
    socket.emit('sendMess', {mess, otherID})

    let messdiv = document.createElement('div')
    messdiv.innerHTML = 
        `<li class="me">
            <div class="entete">
                <h3>${new Date(Date.now()).toLocaleTimeString()}</h3>
                <h2>You</h2>
                <span class="status blue"></span>
            </div>
            <div class="message">
                ${mess}
            </div>
        </li>`
    document.getElementById('chat').append(messdiv.firstChild)
    pageScroll()
}
