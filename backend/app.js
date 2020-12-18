const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

let port = process.env.PORT || 5000;

const rooms = {};
let n = 0;

app.get('/');

function getWinner(room) {
  const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  let board = room.board

  winCondition.forEach((arr) => {
    let [a, b, c] = arr;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      room.winner = board[a] === 'X' ? 
      room.players.player1 : 
      room.players.player2; 
    } else if (room.turn === 9 && !room.winner) {
      room.winner = "It's a Draw!";
    } 
  })
}

io.on('connection', (socket) => {
  socket.on('enter', () => {
    let room = `room${n}`;

    socket.join(room);

    if (!rooms[`${room}`]) {
      rooms[`${room}`] = {'players': {'player1': socket.id}};
      io.to(room).emit('wait')
    } else {
      rooms[`${room}`].players.player2 = socket.id;
      rooms[`${room}`].board = Array(9).fill(null);
      rooms[`${room}`].winner = null;
      rooms[`${room}`].turn = 0;
      n += 1;
      io.to(room).emit('play', rooms[`${room}`].players.player1)
    }
  });

  socket.on('play', (id) => {
    let socketRoom = Array.from(socket.rooms)[1];
    let room = rooms[`${socketRoom}`]
    
    if (!room.board[id] && !room.winner) {
      let turnId;
      let mark;

      if (room.turn % 2 === 0) {
        mark = 'X'
        turnId = room.players.player2
      } else {
        mark = 'O'
        turnId = room.players.player1
      }

      room.turn += 1;
      room.board[id] = mark
      io.to(socketRoom).emit('update', id, mark, turnId);

      getWinner(socketRoom, room)
    }

    if (room.winner) {
      io.to(socketRoom).emit('winner', room.winner);
    }
  });

  socket.on('disconnecting', () => {
    let room = Array.from(socket.rooms)[1];
    if (rooms[`${room}`]) {
      if (rooms[`${room}`].players.player2) {
        delete rooms[`${room}`].players.player2;
        io.to(room).emit('playerDisconnected');
      } else {
        delete rooms[`${room}`];
      }
    }
  });
});

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});