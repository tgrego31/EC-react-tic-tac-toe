import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function calculateWinner(squares, rows = 3, cols = 3) {
  const needed = Math.min(rows, cols);
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const player = squares[r * cols + c];
      if (!player) continue;
      for (const [dr, dc] of directions) {
        const endR = r + (needed - 1) * dr;
        const endC = c + (needed - 1) * dc;
        if (endR < 0 || endR >= rows || endC < 0 || endC >= cols) continue;
        let wins = true;
        for (let step = 1; step < needed; step += 1) {
          if (squares[(r + step * dr) * cols + c + step * dc] !== player) {
            wins = false;
            break;
          }
        }
        if (wins) return player;
      }
    }
  }
  return null;
}

function minimax(board, depth, isMaximizing) {
  const winner = calculateWinner(board);
  if (winner === 'X') return 10 - depth;
  if (winner === 'O') return depth - 10;
  if (!board.includes(null)) return 0;
  let bestScore = isMaximizing ? -Infinity : Infinity;
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] !== null) continue;
    board[i] = isMaximizing ? 'X' : 'O';
    const score = minimax(board, depth + 1, !isMaximizing);
    board[i] = null;
    bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
  }
  return bestScore;
}

function findBestMove(squares, player = 'O', rows = 3, cols = 3) {
  const moveOrder = Array.from({ length: squares.length }, (_, i) => i).sort((a, b) => {
    const rank = (i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const centerDistance = Math.abs(r - (rows - 1) / 2) + Math.abs(c - (cols - 1) / 2);
      return centerDistance;
    };
    return rank(a) - rank(b) || a - b;
  });
  if (rows === 3 && cols === 3) {
    let bestScore = player === 'X' ? -Infinity : Infinity;
    let bestMove = -1;
    for (const index of moveOrder) {
      if (squares[index] !== null) continue;
      const trial = squares.slice();
      trial[index] = player;
      const score = minimax(trial, 0, player === 'O');
      if (player === 'X' ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
    return bestMove;
  }
  const opponent = player === 'X' ? 'O' : 'X';
  for (const side of [player, opponent]) {
    for (const index of moveOrder) {
      if (squares[index] !== null) continue;
      const trial = squares.slice();
      trial[index] = side;
      if (calculateWinner(trial, rows, cols) === side) return index;
    }
  }
  return moveOrder.find((index) => squares[index] === null) ?? -1;
}

function Board({ squares, rows, cols, xIsNext, humanPlayer, onPlay }) {
  const winner = calculateWinner(squares, rows, cols);
  const status = winner ? `Winner: ${winner}` : squares.every(Boolean) ? 'Draw!' : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(index) {
    if (winner || squares[index] || (xIsNext ? 'X' : 'O') !== humanPlayer) return;
    const next = squares.slice();
    next[index] = humanPlayer;
    if (!calculateWinner(next, rows, cols) && next.includes(null)) {
      const computer = humanPlayer === 'X' ? 'O' : 'X';
      const computerMove = findBestMove(next, computer, rows, cols);
      if (computerMove !== -1) next[computerMove] = computer;
    }
    onPlay(next);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board" style={{ gridTemplateColumns: `repeat(${cols}, 42px)` }}>
        {squares.map((value, index) => <Square key={index} value={value} onSquareClick={() => handleClick(index)} />)}
      </div>
    </>
  );
}

export default function Game() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [humanPlayer, setHumanPlayer] = useState('X');
  const currentSquares = history[currentMove];
  const xIsNext = currentSquares.filter(Boolean).length % 2 === 0;

  function handlePlay(nextSquares) {
    const updated = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(updated);
    setCurrentMove(updated.length - 1);
  }

  function resetGame() {
    setHistory([Array(rows * cols).fill(null)]);
    setCurrentMove(0);
    setHumanPlayer('X');
  }

  function switchPlayer() {
    if (calculateWinner(currentSquares, rows, cols) || !currentSquares.includes(null)) return;
    const player = xIsNext ? 'X' : 'O';
    const index = findBestMove(currentSquares, player, rows, cols);
    if (index === -1) return;
    const next = currentSquares.slice();
    next[index] = player;
    handlePlay(next);
    setHumanPlayer(player === 'X' ? 'O' : 'X');
  }

  function resizeBoard(newRows, newCols) {
    const nextRows = Math.max(3, Math.min(8, newRows));
    const nextCols = Math.max(3, Math.min(8, newCols));
    if (nextRows === rows && nextCols === cols) return;
    const next = Array(nextRows * nextCols).fill(null);
    for (let r = 0; r < Math.min(rows, nextRows); r += 1) {
      for (let c = 0; c < Math.min(cols, nextCols); c += 1) {
        next[r * nextCols + c] = currentSquares[r * cols + c];
      }
    }
    setRows(nextRows);
    setCols(nextCols);
    setHistory([next]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} rows={rows} cols={cols} xIsNext={xIsNext} humanPlayer={humanPlayer} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="controls">
          <label>Rows <input type="number" min="3" max="8" value={rows} onChange={(event) => resizeBoard(Number(event.target.value) || 3, cols)} /></label>
          <label>Columns <input type="number" min="3" max="8" value={cols} onChange={(event) => resizeBoard(rows, Number(event.target.value) || 3)} /></label>
        </div>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={switchPlayer}>Switch to Player {humanPlayer === 'X' ? 'O' : 'X'}</button>
        <p>You are playing {humanPlayer}.</p>
        <h3>Time Travel</h3>
        <ol>
          {history.map((_, move) => (
            <li key={move}><button onClick={() => setCurrentMove(move)}>{move === 0 ? 'Go to game start' : `Go to move #${move}`}</button></li>
          ))}
        </ol>
      </div>
    </div>
  );
}
