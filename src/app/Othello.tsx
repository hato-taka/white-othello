'use client'
import React, { useState, useEffect } from "react";

const SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const initializeBoard = () => {
  const board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  return board;
};

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],         [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const isValidMove = (board, row, col, player) => {
  if (board[row][col] !== EMPTY) return false;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx, y = col + dy;
    let foundOpponent = false;

    while (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === opponent) {
      foundOpponent = true;
      x += dx;
      y += dy;
    }

    if (foundOpponent && x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === player) {
      return true;
    }
  }
  return false;
};

const getValidMoves = (board, player) => {
  const moves = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        moves.push([row, col]);
      }
    }
  }
  return moves;
};

const flipDiscs = (board, row, col, player) => {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx, y = col + dy;
    let path = [];

    while (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === opponent) {
      path.push([x, y]);
      x += dx;
      y += dy;
    }

    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === player) {
      path.forEach(([px, py]) => newBoard[px][py] = player);
    }
  }
  return newBoard;
};

const getScore = (board) => {
  let blackCount = 0, whiteCount = 0;
  board.flat().forEach(cell => {
    if (cell === BLACK) blackCount++;
    if (cell === WHITE) whiteCount++;
  });
  return { black: blackCount, white: whiteCount };
};

const Othello = () => {
  const [board, setBoard] = useState(initializeBoard);
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [validMoves, setValidMoves] = useState(getValidMoves(board, BLACK));
  const [passCount, setPassCount] = useState(0);

  useEffect(() => {
    const moves = getValidMoves(board, currentPlayer);
    setValidMoves(moves);
    if (moves.length === 0) {
      setPassCount(prev => prev + 1);
      setCurrentPlayer(prev => (prev === BLACK ? WHITE : BLACK));
    } else {
      setPassCount(0);
    }
  }, [board, currentPlayer]);

  const handleClick = (row, col) => {
    if (!isValidMove(board, row, col, currentPlayer)) return;
    setBoard(flipDiscs(board, row, col, currentPlayer));
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
  };

  const { black, white } = getScore(board);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", background: "#2c3e50", color: "white", padding: "20px", minHeight: "100vh" }}>
      <h1>Othello Game</h1>
      <p>{passCount >= 2 ? "Game Over!" : `Current Player: ${currentPlayer === BLACK ? "⚫ Black" : "⚪ White"}`}</p>
      <p>Score - ⚫ Black: {black} | ⚪ White: {white}</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, minmax(30px, 1fr))`, gap: "3px", background: "#27ae60", padding: "15px", borderRadius: "10px", maxWidth: "90vw", margin: "auto" }}>
        {board.flat().map((cell, index) => {
          const row = Math.floor(index / SIZE);
          const col = index % SIZE;
          const isValid = validMoves.some(([r, c]) => r === row && c === col);

          return (
            <button
              key={index}
              onClick={() => handleClick(row, col)}
              style={{
                width: "100%", height: "100%", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", 
                background: cell === BLACK ? "#2c3e50" : cell === WHITE ? "#ecf0f1" : isValid ? "#f1c40f" : "#27ae60", 
                cursor: "pointer", border: "2px solid #16a085", aspectRatio: "1 / 1"
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Othello;
