const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Forward video offer, answer, and ice candidates to other users
    socket.on('video-offer', (offer) => {
        socket.broadcast.emit('video-offer', offer);
    });

    socket.on('video-answer', (answer) => {
        socket.broadcast.emit('video-answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });

    // Handle chat messages
    socket.on('chat-message', (message) => {
        socket.broadcast.emit('chat-message', message);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
