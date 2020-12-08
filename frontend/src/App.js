import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [turn, setTurn] = useState(0)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [winner, setWinner] = useState(null)
  const [player, setPlayer] = useState('Player 1')
  const [players, setPlayers] = useState(['Player 1', 'Player 2'])

  function Header() {
    return(
      <header>
        <h1>Tic Tac Toe</h1>
        <form id="form">
          <input type="text" id="player1" className="playerName" placeholder="Player 1" />
          <input type="text" id="player2" className="playerName" placeholder="Player 2" />
        </form>
        <button id="submit" onClick={changePlayerName}>Submit</button>
      </header>
    )
  }

  // Create and display the the Tic Tac Toe board
  const DisplayBoard = () => {
    const cell = [];
  
    for (let i = 0; i < 9; i++) {
        cell.push(
          <div
          key={i}
          id={i}
          className='cell'
          onClick={playTurn}>
            &nbsp;
          </div>
        );
    }
  
    return cell;
  }

  // Get the id of the clicked cell and fill the board array with the appropriate sign
  function playTurn(e) {
    let id = e.target.id

    let gameBoard = board.slice()
    if (!gameBoard[id] && !winner) {
      setTurn(turn + 1)
      gameBoard[id] = turn % 2 === 0 ? 'X' : 'O'
    }
    
    setBoard(gameBoard)
  }

  // Verify changes in board array and display it
  useEffect(() => {
    board.forEach((value, index) => {
      if (value) {
        let div = document.getElementById(index)
        div.textContent = value
      }
    })  
  })

  // Verify the board if the winning condition is met
  function getWinner() {
    const winCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    winCondition.forEach((arr) => {
      let [a, b, c] = arr
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(
          board[a] === 'X' ? players[0] : players[1]
        )
      } else if (turn > 8) {
        setWinner('Draw')
      }
    })
  }

  const changePlayerName = (e) => {
    let player1 = document.getElementById('player1').value
    let player2 = document.getElementById('player2').value

    if (player1 && player2) {
      setPlayers([player1, player2])
    } else if (player1) {
      setPlayers([player1, 'Player 2'])
    } else if (player2) {
      setPlayers(['Player 1', player2])
    } else {
      setPlayers(['Player 1', 'Player 2'])
    }

    console.log(player1, player2)
  }

  const getPlayerTurn = () => {
    setPlayer(
      turn % 2 === 0 ? players[0] : players[1]
    )
  }

  // Change the paragraph text to show who plays the turn and the final result
  const changeText = () => {
    let p = document.getElementById('result')
    if (!winner) {
      p.textContent = `${player} turn`
    } else if (winner === 'Draw') {
      p.textContent = "It's a Draw!"
    } else {
      p.textContent = `${winner} Wins!`
    }
  }

  useEffect(() => {
    getWinner()
    getPlayerTurn()
    changeText()
  })


  return (
    <React.Fragment>
      <Header />
      <p id='result'></p>
      <main id='main'>{DisplayBoard()}</main>
    </React.Fragment>
  );
}

export default App;
