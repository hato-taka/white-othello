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
  console.log("cpuMove:", cpuMove);

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
    <div className="text-center font-sans bg-slate-800 text-white p-5 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-4">Othello Game</h1>
      <p className="mb-2">
        {gameOver
          ? "Game Over!"
          : `Current Player: ${currentPlayer === BLACK ? "⚫ Black" : "⚪ White"}`}
      </p>
      <p className="mb-4">Score - ⚫ Black: {black} | ⚪ White: {white}</p>

      <div
        className="grid gap-[1px] rounded-xl max-w-[90vw] mx-auto"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(30px, 1fr))` }}
      >
        {board.flat().map((cell, index) => {
          const row = Math.floor(index / SIZE);
          const col = index % SIZE;
          const isValid = validMoves.some(([r, c]) => r === row && c === col);
          const isLast = lastMove && lastMove[0] === row && lastMove[1] === col;

          return (
            <div
              key={index}
              onClick={() => handleClick(row, col)}
              className={`w-full h-full flex items-center justify-center aspect-square border border-green-900 cursor-pointer ${isLast ? "bg-red-500" : "bg-green-600"}`}
            >
              {cell === BLACK || cell === WHITE ? (
                <div
                  className="w-[70%] h-[70%] rounded-full transition-transform duration-500 animate-[flip_0.6s_ease]"
                  style={{
                    background:
                      cell === BLACK
                        ? "radial-gradient(circle at 30% 30%, #4d4d4d, #1a1a1a)"
                        : "radial-gradient(circle at 30% 30%, #ffffff, #cccccc)",
                    boxShadow:
                      "inset -2px -2px 5px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.3)",
                  }}
                />
              ) : isValid && cell === EMPTY ? (
                <span className="text-yellow-400 text-xl">•</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
          <div className="bg-white text-black p-10 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over</h2>
            <p className="text-xl mb-1">Winner: {winner}</p>
            <p className="text-lg mb-2">Final Score</p>
            <p className="mb-4">⚫ Black: {black} | ⚪ White: {white}</p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2 text-white bg-slate-800 rounded-md hover:bg-slate-700"
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
