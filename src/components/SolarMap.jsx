import React, { useRef, useEffect } from 'react';
import { PLANETS } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

const SCALE = 140 / 71492;

function MedalBadge({ stars }) {
  const colour = stars === 3 ? '#ffd700' : stars === 2 ? '#c0c0c0' : '#cd7f32';
  return (
    <div style={{
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: colour,
      border: '2px solid rgba(0,0,20,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      zIndex: 2,
      boxShadow: `0 0 8px ${colour}`,
    }}>
      {'⭐'.repeat(stars > 1 ? 1 : 1)}
    </div>
  );
}

export default function SolarMap({ playerName, avatar, completedLevels, unlockedIndex, onSelectPlanet, onEditProfile, onParentPortal }) {
  const scrollRef = useRef(null);

  // Auto-scroll to first uncompleted planet
  useEffect(() => {
    if (scrollRef.current) {
      if (unlockedIndex === 0) {
        // Start of game — scroll to left so Mercury is clearly visible
        scrollRef.current.scrollLeft = 0;
      } else {
        const target = (unlockedIndex / (PLANETS.length - 1)) * (scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
        scrollRef.current.scrollLeft = Math.max(0, target - 60);
      }
    }
  }, [unlockedIndex]);

  const allComplete = Object.keys(completedLevels).length === PLANETS.length;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(4,4,20,0.9), transparent)',
        zIndex: 2,
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--star-yellow)',
          }}>
            🌌 Solar System
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '2px' }}>
            {Object.keys(completedLevels).length} / {PLANETS.length} worlds explored
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onParentPortal}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.5)', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Parent Settings"
          >⚙️</button>
          <button
            onClick={onEditProfile}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '40px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', fontSize: '14px', fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '20px' }}>{avatar.emoji}</span>
            <span>{playerName}</span>
          </button>
        </div>
      </div>

      {/* Sun label */}
      <div style={{
        padding: '0 20px 8px',
        flexShrink: 0,
      }}>
        <p style={{ fontSize: '12px', opacity: 0.5, fontStyle: 'italic' }}>
          Tap a world to begin spelling!
        </p>
      </div>

      {/* Scrollable planet track */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '20px 60px',
          gap: '0',
          scrollbarWidth: 'none',
          position: 'relative',
        }}
        className="hide-scrollbar"
      >
        {/* Sun — partially off left edge, Mercury given clear space */}
        <div style={{
          flexShrink: 0,
          position: 'relative',
          width: '100px',
          height: '500px',
          marginLeft: '-400px',
          marginRight: '120px',
        }}>
          {/* Sun disc — 500px diameter, mostly off screen */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 70% 45%, #fffde0, #ffe44d 25%, #ffaa00 55%, #ff6600 80%)',
            boxShadow: '0 0 80px rgba(255,200,0,0.9), 0 0 160px rgba(255,150,0,0.6), 0 0 300px rgba(255,100,0,0.3)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }} />
          {/* Corona glow bleeding right */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 70% 50%, transparent 50%, rgba(255,180,0,0.12) 65%, transparent 80%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Orbital path line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '200px',
          right: '40px',
          height: '2px',
          background: 'linear-gradient(to right, rgba(100,150,255,0.3), rgba(100,150,255,0.1))',
          transform: 'translateY(-50%)',
          zIndex: 0,
        }} />

        {/* Planets */}
        {PLANETS.map((planet, i) => {
          // Saturn renders wider due to rings; Haumea is elliptical
          const baseSize = Math.max(20, Math.round(planet.radius * SCALE));
          const size = baseSize;
          const displayWidth = planet.id === 'saturn'
            ? baseSize * 2.4
            : planet.id === 'haumea'
            ? Math.round(baseSize * 1.6)
            : baseSize;
          const unlocked = i <= unlockedIndex;
          const completed = !!completedLevels[planet.id];
          const isNext = i === unlockedIndex && !completed;
          const stars = completedLevels[planet.id]?.stars;

          return (
            <React.Fragment key={planet.id}>
              {/* Log-scale spacing — feels like real distances */}
              {i > 0 && (() => {
                const prevDist = PLANETS[i - 1].distanceFromSun;
                const thisDist = planet.distanceFromSun;
                // Log of ratio gives proportional feel without infinite spread
                const gap = Math.max(60, Math.round(Math.log(thisDist / prevDist + 1) * 160));
                return <div style={{ flexShrink: 0, width: `${gap}px` }} />;
              })()}

              <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                position: 'relative',
                zIndex: 1,
                cursor: unlocked ? 'pointer' : 'default',
              }}
                onClick={() => unlocked && onSelectPlanet(planet)}
              >
                {/* Planet label above */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                    whiteSpace: 'nowrap',
                  }}>
                    {planet.name}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: planet.type === 'dwarf' ? 'var(--purple-accent)' : 'var(--cyan-accent)',
                  }}>
                    {planet.type === 'dwarf' ? 'Dwarf Planet' : 'Planet'}
                  </div>
                </div>

                {/* Planet visual with glow if next */}
                <div style={{
                  position: 'relative',
                  transition: 'transform 0.2s',
                  filter: !unlocked ? 'grayscale(1) brightness(0.3)' : 'none',
                  animation: isNext ? 'float 2.5s ease-in-out infinite' : 'none',
                }}>
                  {isNext && (
                    <div style={{
                      position: 'absolute',
                      inset: '-8px',
                      borderRadius: '50%',
                      background: 'transparent',
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
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: Math.max(12, size * 0.4),
                    }}>
                      🔒
                    </div>
                  )}
                </div>

                {/* Stars row below */}
                {completed && (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3].map(n => (
                      <span key={n} style={{ fontSize: '12px', opacity: n <= stars ? 1 : 0.2 }}>⭐</span>
                    ))}
                  </div>
                )}

                {isNext && (
                  <div style={{
                    background: 'var(--star-yellow)',
                    color: '#1a0a00',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    ▶ Play
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Deep space end cap */}
        <div style={{ flexShrink: 0, width: '60px', paddingLeft: '20px' }}>
          <span style={{ fontSize: '24px', opacity: 0.3 }}>✨</span>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div style={{
        padding: '12px 20px 20px',
        flexShrink: 0,
        background: 'linear-gradient(to top, rgba(4,4,20,0.9), transparent)',
      }}>
        <div style={{
          height: '6px',
          borderRadius: '3px',
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            borderRadius: '3px',
            background: 'linear-gradient(to right, var(--cyan-accent), var(--star-yellow))',
            width: `${(Object.keys(completedLevels).length / PLANETS.length) * 100}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ marginTop: '6px', fontSize: '11px', textAlign: 'center', opacity: 0.4 }}>
          {allComplete ? '🎉 You have explored the entire solar system!' : `Scroll to explore • ${PLANETS.length - Object.keys(completedLevels).length} worlds remaining`}
        </p>
      </div>
    </div>
  );
}
