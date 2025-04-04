"use client";

import React, { useState, useEffect } from "react";

const SIZE: number = 6;
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
  const board: Board = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(EMPTY)
  );
  const mid = SIZE / 2;
  board[mid - 1][mid - 1] = WHITE;
  board[mid - 1][mid] = BLACK;
  board[mid][mid - 1] = BLACK;
  board[mid][mid] = WHITE;
  return board;
};

const directions: Move[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const isValidMove = (
  board: Board,
  row: number,
  col: number,
  player: number
): boolean => {
  if (board[row][col] !== EMPTY) return false;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx,
      y = col + dy;
    let foundOpponent = false;

    while (
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      board[x][y] === opponent
    ) {
      foundOpponent = true;
      x += dx;
      y += dy;
    }

    if (
      foundOpponent &&
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      board[x][y] === player
    ) {
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

const flipDiscs = (
  board: Board,
  row: number,
  col: number,
  player: number
): Board => {
  const newBoard: Board = board.map((row) => [...row]);
  newBoard[row][col] = player;
  const opponent = player === BLACK ? WHITE : BLACK;

  for (const [dx, dy] of directions) {
    let x = row + dx,
      y = col + dy;
    const path: Move[] = [];

    while (
      x >= 0 &&
      x < SIZE &&
      y >= 0 &&
      y < SIZE &&
      board[x][y] === opponent
    ) {
      path.push([x, y]);
      x += dx;
      y += dy;
    }

    if (x >= 0 && x < SIZE && y >= 0 && y < SIZE && board[x][y] === player) {
      path.forEach(([px, py]) => (newBoard[px][py] = player));
    }
  }
  return newBoard;
};

const getScore = (board: Board): Score => {
  let blackCount = 0,
    whiteCount = 0;
  board.flat().forEach((cell) => {
    if (cell === BLACK) blackCount++;
    if (cell === WHITE) whiteCount++;
  });
  return { black: blackCount, white: whiteCount };
};

const Othello: React.FC = () => {
  const [board, setBoard] = useState<Board>(initializeBoard);
  const [currentPlayer, setCurrentPlayer] = useState<number>(BLACK);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [passCount, setPassCount] = useState<number>(0);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [cpuMove, setCpuMove] = useState<Move | null>(null);
  console.log("cpuMove", cpuMove);

  const { black, white } = getScore(board);
  const gameOver = passCount >= 2;
  const winner = black > white ? "Black" : white > black ? "White" : "Draw";

  const resetGame = () => {
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setCurrentPlayer(BLACK);
    setValidMoves(getValidMoves(newBoard, BLACK));
    setPassCount(0);
    setLastMove(null);
    setCpuMove(null);
  };

  useEffect(() => {
    const moves = getValidMoves(board, currentPlayer);
    setValidMoves(moves);
    if (moves.length === 0) {
      setPassCount((prev) => prev + 1);
      setCurrentPlayer((prev) => (prev === BLACK ? WHITE : BLACK));
    } else {
      setPassCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  useEffect(() => {
    if (!gameOver && currentPlayer === WHITE && board.length > 0) {
      const validMoves = getValidMoves(board, WHITE);
      if (validMoves.length > 0) {
        const randomMove =
          validMoves[Math.floor(Math.random() * validMoves.length)];
        setTimeout(() => {
          setBoard((prev) =>
            flipDiscs(prev, randomMove[0], randomMove[1], WHITE)
          );
          setLastMove(randomMove);
          setCurrentPlayer(BLACK);
        }, 500);
      }
    }
  }, [currentPlayer, gameOver]);

  const handleClick = (row: number, col: number) => {
    if (!isValidMove(board, row, col, currentPlayer)) return;
    setBoard(flipDiscs(board, row, col, currentPlayer));
    setLastMove([row, col]);
    setCpuMove(null);
    setCurrentPlayer(WHITE);
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        background: "#2c3e50",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <h1>Othello Game</h1>
      <p>
        {gameOver
          ? "Game Over!"
          : `Current Player: ${
              currentPlayer === BLACK ? "⚫ Black" : "⚪ White"
            }`}
      </p>
      <p>
        Score - ⚫ Black: {black} | ⚪ White: {white}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${SIZE}, minmax(30px, 1fr))`,
          background: "#27ae60",
          padding: "15px",
          borderRadius: "10px",
          maxWidth: "90vw",
          margin: "auto",
          border: "2px solid #14532d",
        }}
      >
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
            border: "1px solid #14532d",
          };

          const discStyle: React.CSSProperties = {
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            backgroundColor: cell === BLACK ? "#2c3e50" : "#ecf0f1",
            transform: "rotateY(0deg)",
            transition: "transform 0.6s ease",
            animation: "flip 0.6s ease",
          };

          return (
            <div
              key={index}
              onClick={() => handleClick(row, col)}
              style={cellStyle}
            >
              {cell === BLACK || cell === WHITE ? (
                <div style={discStyle} />
              ) : isValid && cell === EMPTY ? (
                <span style={{ color: "#f1c40f", fontSize: "1.5rem" }}>•</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              color: "black",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "2rem" }}>Game Over</h2>
            <p style={{ fontSize: "1.5rem" }}>Winner: {winner}</p>
            <p style={{ fontSize: "1.25rem" }}>Final Score</p>
            <p>
              ⚫ Black: {black} | ⚪ White: {white}
            </p>
            <button
              onClick={resetGame}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "1rem",
                borderRadius: "8px",
                backgroundColor: "#2c3e50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(180deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Othello;
