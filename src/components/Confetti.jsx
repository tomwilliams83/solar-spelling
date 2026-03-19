import React, { useMemo } from 'react';

const COLOURS = ['#ffd700', '#ff6b6b', '#4ade80', '#22d3ee', '#a855f7', '#f97316', '#ec4899'];

export default function Confetti({ count = 50 }) {
  const pieces = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
      size: Math.random() * 8 + 4,
      colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      rotation: Math.random() * 360,
    })),
  [count]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 20,
    }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.colour,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
