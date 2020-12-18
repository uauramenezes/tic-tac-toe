const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

let port = process.env.PORT || 5000;

const {join, canPlay, playTurn, removePlayer} = require('./game');

app.get('/');

io.on('connection', (socket) => {
  socket.on('enter', () => {
    let [room, msg, player] = join(socket.id);

    socket.join(room);
    io.to(room).emit(msg, player);
  });

  socket.on('play', (index) => {
    let room = Array.from(socket.rooms)[1];
    
    if (canPlay(room, socket.id)) {
      let [turnId, mark, winner] = playTurn(room, socket.id, index);
      io.to(room).emit('update', turnId, mark, index);
      if (winner) {
        io.to(room).emit('winner', winner)
      }
    }

    
  });

  socket.on('disconnecting', () => {
    let room = Array.from(socket.rooms)[1];
    removePlayer(room);
    socket.to(room).emit('playerDisconnected');
  });
});

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});