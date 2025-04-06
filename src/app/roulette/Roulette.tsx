// components/Roulette.tsx
'use client';

import { useState } from "react";

type RouletteProps = {
  items: string[];
  radius?: number;
  duration?: number;
};

const Roulette = ({ items, radius = 150, duration = 3 }: RouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const spins = Math.floor(Math.random() * 3) + 3; // 3～5回転
    const rotationAngle = spins * (360 / items.length);
    const rotationDuration = duration * 1000;

    setRotation(rotationAngle);
    setSelectedItem(null);

    setTimeout(() => {
      const index = Math.floor(Math.random() * items.length);
      setSelectedItem(items[index]);
      setIsSpinning(false);
    }, rotationDuration);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${duration}s ease-out`,
        }}
      >
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="rounded-full"
        >
          {items.map((item, index) => {
            const angle = (360 / items.length) * index;
            const x1 = radius + radius * Math.cos((angle * Math.PI) / 180);
            const y1 = radius + radius * Math.sin((angle * Math.PI) / 180);
            const x2 = radius + radius * Math.cos(((angle + 360 / items.length) * Math.PI) / 180);
            const y2 = radius + radius * Math.sin(((angle + 360 / items.length) * Math.PI) / 180);
            const color = `hsl(${(360 / items.length) * index}, 100%, 50%)`;

            return (
              <path
                key={index}
                d={`M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
                fill={color}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* アイテムテキストの配置 */}
        {items.map((item, index) => {
          const angle = (360 / items.length) * index + (360 / items.length) / 2; // セクションの中央に配置
          const x = radius + radius * 0.5 * Math.cos((angle * Math.PI) / 180); // テキストのX座標
          const y = radius + radius * 0.5 * Math.sin((angle * Math.PI) / 180); // テキストのY座標

          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-white font-bold"
              style={{
                transform: `rotate(${angle + 90}deg)`, // テキストを正しい向きに
                transformOrigin: "center",
              }}
            >
              {item}
            </text>
          );
        })}
      </div>
      <button
        onClick={spinRoulette}
        className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg"
        disabled={isSpinning}
      >
        {isSpinning ? "回転中..." : "回す"}
      </button>
      {selectedItem && (
        <div className="mt-4 text-xl font-bold text-blue-500">
          選ばれた項目: {selectedItem}
        </div>
      )}
    </div>
  );
};

export default Roulette;
