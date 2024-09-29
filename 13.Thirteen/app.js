const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve index.html when accessing the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Inform others about the new user
  socket.broadcast.emit('new-user', socket.id);

  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', { offer: data.offer, userId: data.userId });
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', { answer: data.answer, userId: data.userId });
  });

  socket.on('ice-candidate', (data) => {
    socket.broadcast.emit('ice-candidate', { candidate: data.candidate, userId: data.userId });
  });

  socket.on('disconnect', () => {
  console.log('A user disconnected: ' + socket.id);
  // Notify remaining users about the disconnection
  socket.broadcast.emit('user-disconnected', socket.id);
});


});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
