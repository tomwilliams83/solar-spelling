import React, { useState, useEffect, useRef } from 'react';
import { PLANETS } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

const SCALE = 140 / 71492;

export default function TravelScreen({ from, to, onDone }) {
  const [progress, setProgress] = useState(0); // 0 → 1
  const [phase, setPhase] = useState('departing'); // departing | travelling | arriving
  const timerRef = useRef(null);
  const startRef = useRef(null);

  // Planets we pass on the way
  const fromIdx = PLANETS.findIndex(p => p.id === from.id);
  const toIdx = PLANETS.findIndex(p => p.id === to.id);
  const passby = PLANETS.slice(
    Math.min(fromIdx, toIdx) + 1,
    Math.max(fromIdx, toIdx)
  );

  const DURATION = 3500 + passby.length * 600;

  useEffect(() => {
    setTimeout(() => setPhase('travelling'), 600);

    function animate(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);

      if (p < 1) {
        timerRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('arriving');
        setTimeout(onDone, 1200);
      }
    }

    const raf = requestAnimationFrame(ts => {
      startRef.current = ts;
      timerRef.current = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(timerRef.current);
    };
  }, []);

  // Planet grows from tiny dot to large as we approach
  const baseSize = Math.max(40, Math.round(to.radius * SCALE));
  const maxSize = Math.min(300, baseSize * 2.5);
  const currentSize = Math.max(4, Math.round(4 + (maxSize - 4) * progress));

  // Speed lines opacity increases then fades
  const speedOpacity = progress < 0.8 ? Math.min(0.7, progress * 2) : (1 - progress) * 3.5;

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 10, overflow: 'hidden',
    }}>

      {/* Speed lines — streaking stars */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: speedOpacity }}>
        {Array.from({ length: 20 }, (_, i) => {
          const top = 5 + (i * 4.5);
          const width = 40 + Math.random() * 120;
          const left = Math.random() * 60;
          return (
            <div key={i} style={{
              position: 'absolute', top: `${top}%`, left: `${left}%`,
              width: `${width}px`, height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)',
              animation: `star-move ${0.6 + (i % 4) * 0.15}s ${(i * 0.08) % 0.5}s linear infinite`,
            }} />
          );
        })}
      </div>

      {/* Pass-by planets — slide past left to right */}
      {passby.map((p, i) => {
        const threshold = (i + 1) / (passby.length + 1);
        const visible = progress > threshold - 0.15 && progress < threshold + 0.25;
        const localP = visible ? (progress - (threshold - 0.15)) / 0.4 : 0;
        const x = visible ? -30 + localP * 160 : -100; // slide left to right
        const size = Math.max(16, Math.round(p.radius * SCALE * 0.8));

        return (
          <div key={p.id} style={{
            position: 'absolute', left: `${x}%`, top: '35%',
            transform: 'translateY(-50%)',
            opacity: visible ? Math.sin(localP * Math.PI) : 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}>
            <PlanetVisual planet={p} size={size} />
            <p style={{
              textAlign: 'center', fontSize: '10px', marginTop: '4px',
              opacity: 0.6, color: 'white', whiteSpace: 'nowrap',
            }}>{p.name}</p>
          </div>
        );
      })}

      {/* Destination planet — grows from dot */}
      <div style={{
        position: 'relative', zIndex: 2,
        transition: 'none',
        filter: phase === 'arriving' ? 'drop-shadow(0 0 30px rgba(255,255,200,0.5))' : 'none',
      }}>
        <PlanetVisual planet={to} size={currentSize} />
      </div>

      {/* Status text */}
      <div style={{
        position: 'absolute', bottom: '60px', left: 0, right: 0, textAlign: 'center',
      }}>
        {phase === 'departing' && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--star-yellow)', opacity: 0.8 }}>
            🚀 Departing {from.name}...
          </p>
        )}
        {phase === 'travelling' && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--cyan-accent)' }}>
            Approaching {to.name}...
          </p>
        )}
        {phase === 'arriving' && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--green-correct)', animation: 'bounce-in 0.4s ease' }}>
            🎉 Welcome to {to.name}!
          </p>
        )}

        {/* Progress bar */}
        <div style={{
          margin: '12px auto 0', width: '200px', height: '4px',
          borderRadius: '2px', background: 'rgba(255,255,255,0.1)',
        }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: 'linear-gradient(to right, var(--cyan-accent), var(--star-yellow))',
            width: `${progress * 100}%`,
          }} />
        </div>
      </div>

      {/* Cockpit vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(4,4,20,0.8) 100%)',
      }} />
    </div>
  );
}
