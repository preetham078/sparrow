const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// In-memory message history (keeps last 200 messages)
const history = [];

io.on('connection', (socket) => {
  let username = 'Anonymous';

  // send history on connect
  socket.emit('history', history);

  socket.on('join', (name) => {
    username = name || username;
    socket.broadcast.emit('system', `${username} joined the chat`);
  });

  socket.on('chat message', (msg) => {
    const item = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      user: username,
      text: msg,
      time: new Date().toISOString(),
    };
    history.push(item);
    if (history.length > 200) history.shift();
    io.emit('chat message', item);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('system', `${username} left the chat`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
