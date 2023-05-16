var express = require('express');
var http = require('http');
// const bodyParser = require('body-parser');
const fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

let users = []

function generateToken(length) {
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("")
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

app.get('/', function (req, res) {
    res.send("nothing")
})


io.on('connection', (socket) => {

    // users.push(socket.id);

    var socketIP = socket.conn.remoteAddress

    // console.log(socket);

    console.log(socket.id + " connected from " + socketIP);

    socket.on('login', () => {

    })

    socket.on('logout', () => {
        var index = users.findIndex(obj => obj.socket === socket.id)
        console.log(index);
        console.log(users[index].name + ' has logged out')
        users.splice(index, 1)
        console.log(users)
    })

    socket.on('name', (name) => {
        var newToken = generateToken(32);
        users.push({
            socket: socket.id,
            name: name,
            token: newToken
        });
        console.log(users)
        io.to(socket.id).emit('token', { token: newToken })
    })

    socket.on("ping", () => {
        io.emit('pong');
    })

    socket.on("disconnect", () => {
        console.log(socket.id + " has disconnected");
        users.splice(users.findIndex(obj => obj.socket === socket.id), 1)

    });

    socket.on("chat", (msg) => {
        for (let i = 0; i < users.length; i++) {
            io.to(users[i]).emit("new msg", { msg: msg, id: socket.id });
        }
    })

    socket.on("join room", (roomID) => {

    })

});

server.listen({ port: 3000, host: '0.0.0.0' }, function () {
    // console.log('listening on *:3001');
    console.log('Server running on http://localhost:3000');
});

// readFile();