import React, { useRef, useEffect } from 'react';
import { PLANETS } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

const SCALE = 140 / 71492;

// Log-scale gap between two planets (in px)
// Uses ratio of distances so inner planets feel close, outer ones far
function getGap(prevDist, thisDist) {
  return Math.round(Math.log((thisDist / prevDist) + 1) * 180);
}

function MedalBadge({ stars }) {
  const colour = stars === 3 ? '#ffd700' : stars === 2 ? '#c0c0c0' : '#cd7f32';
  return (
    <div style={{
      position: 'absolute', top: '-6px', right: '-6px',
      width: '22px', height: '22px', borderRadius: '50%',
      background: colour, border: '2px solid rgba(0,0,20,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '10px', zIndex: 2, boxShadow: `0 0 8px ${colour}`,
    }}>⭐</div>
  );
}

export default function SolarMap({ playerName, avatar, completedLevels, unlockedIndex, onSelectPlanet, onEditProfile, onParentPortal }) {
  const scrollRef = useRef(null);

  // On mount, scroll so Mercury (index 0) is centred
  useEffect(() => {
    if (!scrollRef.current) return;
    // Short delay to let layout settle
    setTimeout(() => {
      const container = scrollRef.current;
      if (!container) return;
      // Find the Mercury element by data attribute
      const mercuryEl = container.querySelector('[data-planet="mercury"]');
      if (mercuryEl) {
        const containerWidth = container.clientWidth;
        const elLeft = mercuryEl.offsetLeft;
        const elWidth = mercuryEl.offsetWidth;
        container.scrollLeft = elLeft - (containerWidth / 2) + (elWidth / 2);
      }
    }, 80);
  }, []);

  // When unlockedIndex changes, scroll to that planet
  useEffect(() => {
    if (!scrollRef.current) return;
    setTimeout(() => {
      const container = scrollRef.current;
      if (!container) return;
      const planet = PLANETS[unlockedIndex];
      const el = container.querySelector(`[data-planet="${planet.id}"]`);
      if (el) {
        const containerWidth = container.clientWidth;
        container.scrollLeft = el.offsetLeft - (containerWidth / 2) + (el.offsetWidth / 2);
      }
    }, 80);
  }, [unlockedIndex]);

  const allComplete = Object.keys(completedLevels).length === PLANETS.length;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 10 }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px 12px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(4,4,20,0.9), transparent)',
        zIndex: 2, flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--star-yellow)' }}>
            🌌 Solar System
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '2px' }}>
            {Object.keys(completedLevels).length} / {PLANETS.length} worlds explored
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={onParentPortal} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.6)', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title="Parent Settings">⚙️</button>
          <button onClick={onEditProfile} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
            borderRadius: '40px', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)', color: 'white',
            fontSize: '14px', fontWeight: 700,
          }}>
            <span style={{ fontSize: '20px' }}>{avatar.emoji}</span>
            <span>{playerName}</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px 8px', flexShrink: 0 }}>
        <p style={{ fontSize: '12px', opacity: 0.5, fontStyle: 'italic' }}>Tap a world to begin spelling!</p>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowX: 'auto', overflowY: 'hidden',
          display: 'flex', alignItems: 'center',
          // Left padding = half screen so first planet (Mercury) can centre
          // Right padding = half screen so last planet (Eris) can centre
          paddingLeft: '50vw',
          paddingRight: '50vw',
          scrollbarWidth: 'none',
          position: 'relative',
        }}
      >
        {/* Sun — large disc, positioned before Mercury with negative margin so it sits off left */}
        <div style={{
          flexShrink: 0, position: 'relative',
          width: '60px',       // visible sliver of sun
          height: '500px',
          marginLeft: '-560px', // pull sun 500px to the left of Mercury's start
          marginRight: '0px',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle at 70% 45%, #fffde0, #ffe44d 25%, #ffaa00 55%, #ff6600 80%)',
            boxShadow: '0 0 80px rgba(255,200,0,0.9), 0 0 160px rgba(255,150,0,0.6), 0 0 300px rgba(255,100,0,0.3)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle at 70% 50%, transparent 50%, rgba(255,180,0,0.12) 65%, transparent 80%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Orbital path line — sits behind everything */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(to right, rgba(255,150,0,0.4), rgba(100,150,255,0.2), rgba(100,150,255,0.05))',
          transform: 'translateY(-50%)', zIndex: 0, pointerEvents: 'none',
        }} />

        {/* Planets */}
        {PLANETS.map((planet, i) => {
          const baseSize = Math.max(20, Math.round(planet.radius * SCALE));
          const size = baseSize;
          const unlocked = i <= unlockedIndex;
          const completed = !!completedLevels[planet.id];
          const isNext = i === unlockedIndex && !completed;
          const stars = completedLevels[planet.id]?.stars;

          // Gap before this planet
          const gap = i === 0
            ? 0
            : getGap(PLANETS[i - 1].distanceFromSun, planet.distanceFromSun);

          return (
            <React.Fragment key={planet.id}>
              {i > 0 && <div style={{ flexShrink: 0, width: `${gap}px` }} />}

              <div
                data-planet={planet.id}
                style={{
                  flexShrink: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1,
                  cursor: unlocked ? 'pointer' : 'default',
                }}
                onClick={() => unlocked && onSelectPlanet(planet)}
              >
                {/* Label */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                    color: unlocked ? 'white' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap',
                  }}>{planet.name}</div>
                  <div style={{
                    fontSize: '10px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px',
                    color: planet.type === 'dwarf' ? 'var(--purple-accent)' : 'var(--cyan-accent)',
                  }}>{planet.type === 'dwarf' ? 'Dwarf' : 'Planet'}</div>
                </div>

                {/* Planet visual */}
                <div style={{
                  position: 'relative',
                  filter: !unlocked ? 'grayscale(1) brightness(0.3)' : 'none',
                  animation: isNext ? 'float 2.5s ease-in-out infinite' : 'none',
                }}>
                  {isNext && (
                    <div style={{
                      position: 'absolute', inset: '-8px', borderRadius: '50%',
                      border: '2px dashed rgba(255,232,124,0.6)',
                      animation: 'spin 4s linear infinite',
                    }} />
                  )}
                  <PlanetVisual planet={planet} size={size} />
                  {completed && (
                    <div style={{ position: 'absolute', top: '-6px', right: '-6px', zIndex: 3 }}>
                      <MedalBadge stars={stars} />
                    </div>
                  )}
                  {!unlocked && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: Math.max(12, size * 0.4),
                    }}>🔒</div>
                  )}
                </div>

                {/* Stars */}
                {completed && (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3].map(n => <span key={n} style={{ fontSize: '11px', opacity: n <= stars ? 1 : 0.2 }}>⭐</span>)}
                  </div>
                )}

                {isNext && (
                  <div style={{
                    background: 'var(--star-yellow)', color: '#1a0a00',
                    fontSize: '10px', fontWeight: 800, padding: '3px 8px',
                    borderRadius: '20px', whiteSpace: 'nowrap', textTransform: 'uppercase',
                  }}>▶ Play</div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Deep space end cap */}
        <div style={{ flexShrink: 0, width: '40px' }}>
          <span style={{ fontSize: '20px', opacity: 0.2 }}>✨</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        padding: '12px 20px 20px', flexShrink: 0,
        background: 'linear-gradient(to top, rgba(4,4,20,0.9), transparent)',
      }}>
        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(to right, var(--cyan-accent), var(--star-yellow))',
            width: `${(Object.keys(completedLevels).length / PLANETS.length) * 100}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ marginTop: '6px', fontSize: '11px', textAlign: 'center', opacity: 0.4 }}>
          {allComplete ? '🎉 You have explored the entire solar system!' : `Scroll to explore · ${PLANETS.length - Object.keys(completedLevels).length} worlds remaining`}
        </p>
      </div>
    </div>
  );
}
