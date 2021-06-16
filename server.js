const express = require('express')
const Filter = require('bad-words')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const metadata = require('./public/js/metadata')
const {addUser,removeUser,getUser,getUserInRoom} = require('./public/js/user')
const qs = require('qs')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 1000

const publicDirectory = path.join(__dirname+'/public')

app.use(express.static(publicDirectory))

io.on('connection', (socket)=>{

    socket.on('join',({username,room}, callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})

        if(error)
            return callback(error)

        socket.join(user.room)
        socket.emit('event', "Welcome!")
        socket.broadcast.to(room).emit('event', `Wild ${user.username} appeared`)

        io.to(room).emit('userlist',getUserInRoom(room))

        callback()

    })

    socket.on('sendMessage', (message, callback)=>{
        const {error,user} = getUser(socket.id)
        if(error)
            return callback(error)

        const filter = new Filter()
        
        if(message == '')
            return callback('Write some text')

        if(filter.isProfane(message))
            return callback('Profanity not allowed')

        io.to(user.room).emit('message',metadata(message,user.username))
        callback('message delivered')
    })

    socket.on('sendLocation', ({latitude,longitude}, callback)=>{
        const {error,user} = getUser(socket.id)

        if(error)
            callback(error)

        io.to(user.room).emit('locationMessage', `https:google.com/maps?q=${latitude},${longitude}`, user.username)
        callback('Location shared')
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user)
            io.to(user.room).emit('event', `${user.username} left the room`)
    })

})

server.listen(PORT, (err)=>{
    if(err)
        return console.log(err)

    return console.log(`Server is running at port ${PORT}`)
})