'use client';

import React, { useState, useEffect } from "react";

const SIZE: number = 8;
const EMPTY: number = 0;
const BLACK: number = 1;
const WHITE: number = 2;

type Board = number[][];
type Move = [number, number];

type Score = {
  black: number;
  white: number;
};

const initializeBoard = (): Board => {
  const board: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  return board;
};

const directions: Move[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],         [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const isValidMove = (board: Board, row: number, col: number, player: number): boolean => {
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

const getValidMoves = (board: Board, player: number): Move[] => {
  const moves: Move[] = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        moves.push([row, col]);
      }
    }
  }
  return moves;
};

const flipDiscs = (board: Board, row: number, col: number, player: number): Board => {
  const newBoard: Board = board.map(row => [...row]);
  newBoard[row][col] = player;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx, y = col + dy;
    let path: Move[] = [];

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

const getScore = (board: Board): Score => {
  let blackCount = 0, whiteCount = 0;
  board.flat().forEach(cell => {
    if (cell === BLACK) blackCount++;
    if (cell === WHITE) whiteCount++;
  });
  return { black: blackCount, white: whiteCount };
};

const Othello: React.FC = () => {
  const [board, setBoard] = useState<Board>(initializeBoard);
  const [currentPlayer, setCurrentPlayer] = useState<number>(BLACK);
  const [validMoves, setValidMoves] = useState<Move[]>(getValidMoves(board, BLACK));
  const [passCount, setPassCount] = useState<number>(0);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [cpuMove, setCpuMove] = useState<Move | null>(null);

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

  useEffect(() => {
    if (currentPlayer === WHITE) {
      const validMoves = getValidMoves(board, WHITE);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        setTimeout(() => {
          setBoard(flipDiscs(board, randomMove[0], randomMove[1], WHITE));
          setLastMove(randomMove);
          setCpuMove(randomMove);
          setCurrentPlayer(BLACK);
        }, 500);
      }
    }
  }, [currentPlayer, board]);

  const handleClick = (row: number, col: number) => {
    if (!isValidMove(board, row, col, currentPlayer)) return;
    setBoard(flipDiscs(board, row, col, currentPlayer));
    setLastMove([row, col]);
    setCpuMove(null);
    setCurrentPlayer(WHITE);
  };

  const { black, white } = getScore(board);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", background: "#2c3e50", color: "white", padding: "20px", minHeight: "100vh" }}>
      <h1>Othello Game</h1>
      <p>{passCount >= 2 ? "Game Over!" : `Current Player: ${currentPlayer === BLACK ? "⚫ Black" : "⚪ White"}`}</p>
      <p>Score - ⚫ Black: {black} | ⚪ White: {white}</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, minmax(30px, 1fr))`, background: "#27ae60", padding: "15px", borderRadius: "10px", maxWidth: "90vw", margin: "auto", border: "2px solid #14532d" }}>
        {board.flat().map((cell, index) => {
          const row = Math.floor(index / SIZE);
          const col = index % SIZE;
          const isValid = validMoves.some(([r, c]) => r === row && c === col);
          const isLast = lastMove && lastMove[0] === row && lastMove[1] === col;

          const cellStyle: React.CSSProperties = {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isLast ? "#e74c3c" : "#27ae60",
            cursor: "pointer",
            aspectRatio: "1 / 1",
            boxSizing: "border-box",
            border: "1px solid #14532d"
          };

          return (
            <div
              key={index}
              onClick={() => handleClick(row, col)}
              style={cellStyle}
            >
              {cell === BLACK && <div style={{ width: "70%", height: "70%", borderRadius: "50%", backgroundColor: "#2c3e50" }} />}
              {cell === WHITE && <div style={{ width: "70%", height: "70%", borderRadius: "50%", backgroundColor: "#ecf0f1" }} />}
              {isValid && cell === EMPTY && <span style={{ color: "#f1c40f", fontSize: "1.5rem" }}>•</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Othello;
