import Link from "next/link";
import React from "react";

interface GameOverModalProps {
  winner: string;
  white: number;
  black: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  white,
  black,
  onRestart,
}) => {
  // TODO: 46円の賞金のルーレット画面を作る
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <div className="bg-white text-black p-10 rounded-2xl text-center">
        <p className="text-xl mb-1">Winner: {winner}</p>
        {winner === "プレイヤー" && (
          <>
            <p className="text-2xl font-bold text-green-600 my-2">
              おめでとうございます！
            </p>
            <Link
              href="https://pay.paypay.ne.jp/yKnAjnmGmqypAWT6"
              className="font-bold text-blue-600 text-2xl underline hover:text-blue-800"
            >
              賞金ゲット！
            </Link>
          </>
        )}
        <p className="text-lg my-2">Final Score</p>
        <p className="mb-4">
          ⚪ プレイヤー: {white} | ⚫ CPU: {black}
        </p>
        <button
          onClick={onRestart}
          className="mt-4 px-6 py-2 text-white bg-slate-800 rounded-md hover:bg-slate-700"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
