require('dotenv').config()
const http = require('http');
const express = require('express');

const PORT = process.env.PORT || 3333;

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

app.get('/', (req, res) => {
    res.send('hello world')
});

io.on('connection', socket => {
    const username = socket.handshake.query['name'];
    console.log("new websocket connection");

    // Send to newly connected user
    socket.emit('message', { username: "ChatCord bot", message: `Welcome to my chat app ${username}` });
    // Send to everyone eles
    socket.broadcast.emit('message', { username: "ChatCord bot", message: `${username} connected` });

    socket.on('message-sent', message => {
        // console.log(message);
        socket.broadcast.emit('message', { username: username, message: message });
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('message', { username: "ChatCord bot", message: `${username} has left the chat.` });
    });
});


server.listen(
    PORT,
    console.log(`Server started and listening on port ${PORT} http://localhost:${PORT}`)
);
