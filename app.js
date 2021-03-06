const {join, canPlay, play, finishGame} = require('./game');
const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

let port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('enter', () => {
    let [room, msg, player] = join(socket.id);

    socket.join(room);
    io.to(room).emit(msg, player);
  });

  socket.on('play', (index) => {
    let room = Array.from(socket.rooms)[1];
    
    if (canPlay(room, socket.id, index)) {
      let [turnId, mark, winner] = play(room, index);
      io.to(room).emit('update', turnId, mark, index);
      if (winner) {
        io.to(room).emit('winner', winner)
      }
    }
  });

  socket.on('disconnecting', () => {
    let room = Array.from(socket.rooms)[1];
    socket.to(room).emit('opponentDisconnected');
    finishGame(room);
  });
});

http.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}/`)
});