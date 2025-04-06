"use client";

import React, { useState, useEffect } from "react";
import {
  SIZE,
  EMPTY,
  BLACK,
  WHITE,
  Board,
  Move,
  initializeBoard,
  isValidMove,
  getValidMoves,
  flipDiscs,
  getScore,
} from "./othelloLogic";
import GameOverModal from "./GameOverModal";

const Othello: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const MAX_HINTS = 3;
  const [hintCount, setHintCount] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [board, setBoard] = useState<Board>(initializeBoard);
  const [currentPlayer, setCurrentPlayer] = useState<number>(WHITE);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [passCount, setPassCount] = useState<number>(0);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [, setCpuMove] = useState<Move | null>(null);

  const { black, white } = getScore(board);
  const gameOver = passCount >= 2;
  const winner = white > black ? "プレイヤー" : black > white ? "CPU" : "引き分け";

  const resetGame = () => {
    setShowModal(false);
    const newBoard = initializeBoard();
    setBoard(newBoard);
    setCurrentPlayer(WHITE);
    setValidMoves(getValidMoves(newBoard, BLACK));
    setPassCount(0);
    setLastMove(null);
    setCpuMove(null);
    setHintCount(0);
    setShowHint(true);
  };

  useEffect(() => {
    const moves = getValidMoves(board, currentPlayer);
    setValidMoves(moves);

    if (moves.length === 0) {
      if (passCount + 1 >= 2) {
        setPassCount(2);
        setShowHint(true);
        setTimeout(() => setShowModal(true), 3000);
      } else {
        setPassCount((prev) => prev + 1);
        setCurrentPlayer((prev) => (prev === BLACK ? WHITE : BLACK));
      }
    } else {
      setPassCount(0);
    }
  }, [board, currentPlayer, passCount]);

  useEffect(() => {
    if (!gameOver && currentPlayer === BLACK && board.length > 0) {
      const validMoves = getValidMoves(board, BLACK);
      if (validMoves.length > 0) {
        const randomMove =
          validMoves[Math.floor(Math.random() * validMoves.length)];
        setTimeout(() => {
          setBoard((prev) =>
            flipDiscs(prev, randomMove[0], randomMove[1], BLACK)
          );
          setLastMove(randomMove);
          setCurrentPlayer(WHITE);
        }, 500);
      }
    }
  }, [currentPlayer, gameOver, board]);

  const handleClick = (row: number, col: number) => {
    if (!isValidMove(board, row, col, currentPlayer)) return;
    setBoard(flipDiscs(board, row, col, currentPlayer));
    setLastMove([row, col]);
    setCpuMove(null);

    const totalDiscs = board.flat().filter(cell => cell !== EMPTY).length;
    if (totalDiscs >= SIZE * SIZE - 1) {
      setShowHint(true);
    } else {
      setShowHint(false);
    }

    setHintCount((prev) => prev);
    setCurrentPlayer(BLACK);
  };

  return (
    <div className="text-center font-sans bg-slate-800 text-white p-5 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-4">白だけオセロ</h1>
      <p className="mb-2">
        {gameOver
          ? "Game Over!"
          : `${currentPlayer === WHITE ? "⚪ プレイヤー" : "⚫ CPU"}の手番です`}
      </p>
      <div className="mb-6 text-lg flex justify-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-300 mb-1">プレイヤー</span>
          <span className="inline-block px-6 py-3 bg-white text-black text-2xl font-bold rounded-full shadow">
            ⚪ {black + white >= SIZE * SIZE - 10 && !gameOver ? "??" : white}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-300 mb-1">CPU</span>
          <span className="inline-block px-6 py-3 bg-gray-300 text-black text-2xl font-bold rounded-full shadow">
            ⚫ {black + white >= SIZE * SIZE - 10 && !gameOver ? "??" : black}
          </span>
        </div>
      </div>

      <div
        className="grid gap-[1px] rounded-xl w-full max-w-[90vw] md:max-w-[500px] mx-auto"
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
              className={`w-full h-full flex items-center justify-center aspect-square border border-green-900 cursor-pointer ${
                isLast ? "bg-red-500" : "bg-green-600"
              }`}
            >
              {cell === BLACK || cell === WHITE ? (
                <div
                  className="w-[70%] h-[70%] rounded-full transition-transform duration-500 animate-[flip_0.6s_ease]"
                  style={{
                    background: showHint
                      ? cell === BLACK
                        ? "radial-gradient(circle at 30% 30%, #4d4d4d, #1a1a1a)"
                        : "radial-gradient(circle at 30% 30%, #ffffff, #cccccc)"
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

      <div className="mt-6">
        <button
          onClick={() => {
            if (hintCount < MAX_HINTS) {
              setShowHint(true);
              setHintCount((prev) => prev + 1);
            }
          }}
          disabled={hintCount >= MAX_HINTS}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          ヒントを見る（残り{MAX_HINTS - hintCount}回）
        </button>
      </div>

      {showModal && (
        <GameOverModal
          winner={winner}
          white={white}
          black={black}
          onRestart={resetGame}
        />
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
