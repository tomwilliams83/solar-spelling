import React, { useState, useEffect, useRef } from 'react';
import { PLANETS } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

// Cockpit HUD — first person view from inside the rocket
// Shows current destination planet ahead, with other planets visible as dots in the distance

export default function SolarMap({ playerName, avatar, completedLevels, unlockedIndex, onSelectPlanet, onEditProfile, onParentPortal }) {

  const currentPlanet = PLANETS[unlockedIndex];
  const [approachAnim, setApproachAnim] = useState(false);

  // Trigger approach animation when planet changes
  useEffect(() => {
    setApproachAnim(false);
    const t = setTimeout(() => setApproachAnim(true), 100);
    return () => clearTimeout(t);
  }, [unlockedIndex]);

  const completed = !!completedLevels[currentPlanet.id];
  const totalDone = Object.keys(completedLevels).length;

  // Work out planet display size - fills a good chunk of screen
  const SCALE = 140 / 71492;
  const baseSize = Math.max(60, Math.round(currentPlanet.radius * SCALE));
  // Cap so it fills the screen nicely but doesn't overflow
  const planetSize = Math.min(280, Math.max(60, baseSize * 2));

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      zIndex: 10, overflow: 'hidden',
    }}>

      {/* ── Cockpit window / space view ── */}
      <div style={{
        flex: 1, position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>

        {/* Sun glow behind — always faintly visible */}
        <div style={{
          position: 'absolute', bottom: '-200px', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,180,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Distant planets — small dots in the background */}
        {PLANETS.map((p, i) => {
          if (i === unlockedIndex) return null; // skip current
          const isDone = !!completedLevels[p.id];
          const isAhead = i > unlockedIndex;
          const isBehind = i < unlockedIndex;

          // Position dots around the edges of the view
          const angle = ((i - unlockedIndex) * 28 + 360) % 360;
          const rad = (angle * Math.PI) / 180;
          const dist = isAhead ? 38 : 20; // % from centre
          const x = 50 + Math.cos(rad) * dist;
          const y = 50 + Math.sin(rad) * dist * 0.5; // squash vertically for perspective
          const dotSize = Math.max(4, Math.round(p.radius * SCALE * 0.3));

          return (
            <div key={p.id} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: isBehind ? 0.25 : isAhead ? 0.5 : 1,
              filter: isBehind ? 'grayscale(1)' : 'none',
              pointerEvents: 'none',
              transition: 'all 0.5s',
            }}>
              <PlanetVisual planet={p} size={Math.max(4, dotSize)} />
              {isAhead && (
                <p style={{
                  position: 'absolute', top: '100%', left: '50%',
                  transform: 'translateX(-50%)', marginTop: '3px',
                  fontSize: '8px', opacity: 0.4, whiteSpace: 'nowrap',
                  color: 'white',
                }}>{p.name}</p>
              )}
            </div>
          );
        })}

        {/* Main planet — current destination, large and centred */}
        <div
          onClick={() => onSelectPlanet(currentPlanet)}
          style={{
            position: 'relative', cursor: 'pointer', zIndex: 2,
            transition: 'transform 0.15s',
            animation: approachAnim ? 'approach 1.2s cubic-bezier(0.22,1,0.36,1) both' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <PlanetVisual planet={currentPlanet} size={planetSize} />

          {/* Pulse ring */}
          {!completed && (
            <div style={{
              position: 'absolute', inset: `-${planetSize * 0.12}px`,
              borderRadius: '50%',
              border: '2px dashed rgba(255,232,124,0.5)',
              animation: 'spin 6s linear infinite',
            }} />
          )}

          {/* Completed tick */}
          {completed && (
            <div style={{
              position: 'absolute', top: '-8px', right: '-8px',
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#ffd700', border: '2px solid rgba(0,0,20,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', boxShadow: '0 0 12px #ffd700',
            }}>⭐</div>
          )}
        </div>

        {/* Planet name + tap prompt */}
        <div style={{
          position: 'absolute', bottom: '24px', left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
            color: 'var(--star-yellow)', textShadow: '0 0 20px rgba(255,232,124,0.4)',
            marginBottom: '4px',
          }}>{currentPlanet.name}</p>
          <p style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px' }}>
            {currentPlanet.type === 'dwarf' ? 'Dwarf Planet' : 'Planet'} · {currentPlanet.distanceFromSun} AU from Sun
          </p>
          <p style={{
            marginTop: '10px', fontSize: '14px', fontWeight: 700,
            color: 'var(--cyan-accent)', opacity: 0.9,
            animation: 'float 2s ease-in-out infinite',
          }}>
            {completed ? '🔁 Replay level' : '👆 Tap to land & spell!'}
          </p>
        </div>

        {/* Cockpit frame overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 85% 75% at 50% 50%, transparent 60%, rgba(4,4,20,0.7) 100%)
          `,
        }} />

        {/* Cockpit bottom panel */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px',
          background: 'linear-gradient(to top, rgba(4,4,20,0.95), transparent)',
        }} />
      </div>

      {/* ── Dashboard strip ── */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(4,4,20,0.97)',
        borderTop: '1px solid rgba(100,150,255,0.15)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>

        {/* Avatar + name */}
        <button onClick={onEditProfile} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
          borderRadius: '30px', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)', color: 'white',
          fontSize: '13px', fontWeight: 700, flexShrink: 0,
        }}>
          <span style={{ fontSize: '20px' }}>{avatar.emoji}</span>
          <span>{playerName}</span>
        </button>

        {/* Progress planets — mini row */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '4px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {PLANETS.map((p, i) => {
            const done = !!completedLevels[p.id];
            const isCurrent = i === unlockedIndex;
            const size = Math.max(10, Math.round(p.radius * SCALE * 0.7));
            return (
              <div key={p.id} style={{
                flexShrink: 0, opacity: done ? 1 : isCurrent ? 0.9 : 0.25,
                filter: done || isCurrent ? 'none' : 'grayscale(1)',
                position: 'relative',
                outline: isCurrent ? '2px solid var(--star-yellow)' : 'none',
                outlineOffset: '3px', borderRadius: '50%',
              }}
                onClick={() => (done || isCurrent) && onSelectPlanet(p)}
                title={p.name}
              >
                <PlanetVisual planet={p} size={Math.max(10, size)} />
              </div>
            );
          })}
        </div>

        {/* Settings */}
        <button onClick={onParentPortal} style={{
          width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)', fontSize: '15px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>⚙️</button>
      </div>
    </div>
  );
}
