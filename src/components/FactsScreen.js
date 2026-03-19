import React, { useState, useEffect } from 'react';
import { PlanetVisual } from './PlanetVisual.js';
import Confetti from './Confetti.js';

export default function FactsScreen({ planet, score, avatar, playerName, onContinue }) {
  const [factIndex, setFactIndex] = useState(0);
  const [showMedal, setShowMedal] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const { stars } = score;
  const medalColour = stars === 3 ? '#ffd700' : stars === 2 ? '#c0c0c0' : '#cd7f32';
  const medalLabel = stars === 3 ? 'Gold' : stars === 2 ? 'Silver' : 'Bronze';
  const medalEmoji = stars === 3 ? '🥇' : stars === 2 ? '🥈' : '🥉';

  useEffect(() => {
    setTimeout(() => setShowMedal(true), 400);
    setTimeout(() => setShowContinue(true), 1200);
  }, []);

  function nextFact() {
    if (factIndex < planet.facts.length - 1) setFactIndex(i => i + 1);
  }
  function prevFact() {
    if (factIndex > 0) setFactIndex(i => i - 1);
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 10,
      overflow: 'hidden',
    }}>
      {stars >= 2 && <Confetti />}

      {/* Planet backdrop glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${planet.colour}22, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px 24px',
        gap: '0',
        overflowY: 'auto',
      }}>

        {/* Header with planet */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }} className="animate-slide-up">
          <PlanetVisual
            planet={planet}
            size={80}
            style={{ margin: '0 auto', animation: 'float 3s ease-in-out infinite' }}
          />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--star-yellow)',
            marginTop: '12px',
          }}>
            {planet.name} Explored! 🎉
          </h2>
          <p style={{ opacity: 0.7, fontSize: '14px', marginTop: '4px' }}>
            {playerName} got {score.score} correct
          </p>
        </div>

        {/* Medal */}
        {showMedal && (
          <div style={{
            textAlign: 'center',
            marginBottom: '24px',
            animation: 'medal-drop 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
          }}>
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '16px 28px',
              borderRadius: 'var(--radius-lg)',
              background: `linear-gradient(135deg, ${medalColour}22, ${medalColour}11)`,
              border: `2px solid ${medalColour}88`,
              boxShadow: `0 0 30px ${medalColour}44`,
            }}>
              <span style={{ fontSize: '48px' }}>{medalEmoji}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3].map(n => (
                  <span key={n} style={{ fontSize: '20px', opacity: n <= stars ? 1 : 0.2 }}>⭐</span>
                ))}
              </div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '16px',
                color: medalColour,
                letterSpacing: '1px',
              }}>
                {medalLabel} Medal Earned!
              </p>
            </div>
          </div>
        )}

        {/* Facts section */}
        <div style={{
          background: 'rgba(13,27,75,0.7)',
          border: '1px solid rgba(100,150,255,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          marginBottom: '20px',
          flex: 1,
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--cyan-accent)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            🔭 Amazing Facts about {planet.name}
          </h3>

          <div style={{
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <p key={factIndex} className="animate-slide-up" style={{
              fontSize: '16px',
              lineHeight: 1.6,
              fontWeight: 600,
            }}>
              {planet.facts[factIndex]}
            </p>
          </div>

          {/* Dot nav */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            {planet.facts.map((_, i) => (
              <button
                key={i}
                onClick={() => setFactIndex(i)}
                style={{
                  width: i === factIndex ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === factIndex ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={prevFact}
              disabled={factIndex === 0}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: factIndex === 0 ? 'rgba(255,255,255,0.2)' : 'white',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              ← Prev
            </button>
            <button
              onClick={nextFact}
              disabled={factIndex === planet.facts.length - 1}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: factIndex === planet.facts.length - 1 ? 'rgba(255,255,255,0.2)' : 'white',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Continue button */}
        {showContinue && (
          <button
            onClick={onContinue}
            className="animate-slide-up"
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
              color: '#1a0a00',
              fontSize: '19px',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span>🚀</span>
            <span>Fly to the Next World!</span>
          </button>
        )}
      </div>
    </div>
  );
}
