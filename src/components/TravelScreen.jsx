import React, { useState, useEffect, useRef } from 'react';
import { PLANETS } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

// Which planets do you pass through going from `from` to `to`?
function getPassByPlanets(from, to) {
  const fromIdx = PLANETS.findIndex(p => p.id === from.id);
  const toIdx = PLANETS.findIndex(p => p.id === to.id);
  if (fromIdx === -1 || toIdx === -1 || toIdx <= fromIdx + 1) return [];
  // Return planets between from and to (exclusive of both)
  return PLANETS.slice(fromIdx + 1, toIdx);
}

export default function TravelScreen({ from, to, onDone }) {
  const [phase, setPhase] = useState('launching'); // launching | travelling | arriving
  const [rocketPos, setRocketPos] = useState(-15); // % across screen
  const [passedPlanets, setPassedPlanets] = useState([]);
  const timerRef = useRef();

  const passby = getPassByPlanets(from, to);
  const travelTime = 3000 + passby.length * 600;

  useEffect(() => {
    // Start travel
    setPhase('travelling');

    // Animate rocket
    let start = null;
    let frame;
    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / travelTime, 1);
      setRocketPos(-15 + pct * 130); // -15% to 115%

      // Mark passed planets
      if (passby.length > 0) {
        passby.forEach((planet, i) => {
          const threshold = ((i + 1) / (passby.length + 1)) * travelTime;
          if (elapsed > threshold) {
            setPassedPlanets(prev => prev.includes(planet.id) ? prev : [...prev, planet.id]);
          }
        });
      }

      if (pct < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setPhase('arriving');
        timerRef.current = setTimeout(onDone, 1200);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); clearTimeout(timerRef.current); };
  }, []);

  // Place pass-by planets at evenly-spaced positions across the screen
  const planetPositions = passby.map((p, i) => ({
    planet: p,
    x: ((i + 1) / (passby.length + 1)) * 100,
  }));

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      overflow: 'hidden',
    }}>
      {/* Status text */}
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 2 }}>
        {phase === 'launching' && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--star-yellow)' }}>
            🚀 Preparing for launch...
          </p>
        )}
        {phase === 'travelling' && (
          <>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--cyan-accent)', marginBottom: '8px' }}>
              Flying to {to.name}!
            </p>
            {passby.length > 0 && (
              <p style={{ fontSize: '13px', opacity: 0.6 }}>
                Passing by: {passby.map(p => p.name).join(', ')}
              </p>
            )}
          </>
        )}
        {phase === 'arriving' && (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--green-correct)', animation: 'bounce-in 0.5s ease' }}>
            🎉 Arrived at {to.name}!
          </p>
        )}
      </div>

      {/* Travel track */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Track line */}
        <div style={{
          position: 'absolute',
          left: '5%',
          right: '5%',
          height: '3px',
          background: 'linear-gradient(to right, rgba(255,232,124,0.1), rgba(34,211,238,0.4), rgba(168,85,247,0.1))',
          borderRadius: '2px',
        }} />

        {/* From planet (left) */}
        <div style={{
          position: 'absolute',
          left: '5%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}>
          <PlanetVisual planet={from} size={28} />
          <span style={{ fontSize: '10px', opacity: 0.5 }}>{from.name}</span>
        </div>

        {/* Destination planet (right) */}
        <div style={{
          position: 'absolute',
          right: '5%',
          transform: 'translateX(50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          animation: phase === 'arriving' ? 'pulse-glow 0.5s ease' : 'none',
        }}>
          <PlanetVisual planet={to} size={36} />
          <span style={{ fontSize: '10px', opacity: 0.8, color: 'var(--star-yellow)' }}>{to.name}</span>
        </div>

        {/* Pass-by planets */}
        {planetPositions.map(({ planet, x }) => {
          const isPassed = passedPlanets.includes(planet.id);
          return (
            <div
              key={planet.id}
              style={{
                position: 'absolute',
                left: `${x}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'opacity 0.5s',
                opacity: isPassed ? 0.4 : 0.8,
              }}
            >
              <PlanetVisual planet={planet} size={Math.max(16, Math.round(planet.radius / 3000))} />
              <span style={{ fontSize: '9px', opacity: 0.5 }}>{planet.name}</span>
            </div>
          );
        })}

        {/* Rocket */}
        <div style={{
          position: 'absolute',
          left: `${rocketPos}%`,
          transform: 'translateY(-50%) translateX(-50%)',
          top: '50%',
          fontSize: '28px',
          transition: 'none',
          filter: 'drop-shadow(0 0 8px rgba(255,200,50,0.8))',
          zIndex: 2,
        }}>
          🚀
        </div>
      </div>

      {/* Star streaks for speed effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${10 + i * 7}%`,
              width: `${30 + Math.random() * 40}px`,
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
              animation: `star-move ${0.8 + Math.random() * 0.6}s ${i * 0.1}s linear infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
