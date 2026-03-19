import React, { useState } from 'react';
import { AVATARS } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';
import { PLANETS } from '../data/levels.js';

export default function WelcomeScreen({ onStart, existingSave }) {
  const [name, setName] = useState(existingSave?.playerName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATARS.find(a => a.id === existingSave?.avatarId) || AVATARS[0]
  );
  const [nameError, setNameError] = useState(false);
  const [started, setStarted] = useState(false);

  function handleGo() {
    if (!name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 600);
      return;
    }
    setStarted(true);
    setTimeout(() => onStart(name.trim(), selectedAvatar), 400);
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      padding: '24px',
      gap: '0',
      opacity: started ? 0 : 1,
      transition: 'opacity 0.4s',
    }}>
      {/* Title area */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }} className="animate-slide-up">
        <div style={{ fontSize: '48px', marginBottom: '-8px' }}>🚀</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: 800,
          color: 'var(--star-yellow)',
          textShadow: '0 0 30px rgba(255,232,124,0.6)',
          lineHeight: 1.1,
          letterSpacing: '-0.5px',
        }}>
          Solar Spelling
        </h1>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(16px, 3.5vw, 22px)',
          fontWeight: 600,
          color: 'var(--cyan-accent)',
          opacity: 0.9,
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Adventure
        </h2>
        <p style={{
          marginTop: '8px',
          fontSize: '14px',
          color: 'rgba(240,244,255,0.6)',
          fontStyle: 'italic',
        }}>
          Spell your way across the solar system!
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(13,27,75,0.85)',
        border: '1px solid rgba(100,150,255,0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 24px',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,20,0.8)',
        animation: 'slide-up 0.5s 0.1s ease both',
      }}>

        {/* Name input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--star-yellow)',
          }}>
            ✨ What's your name, Explorer?
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGo()}
            placeholder="Type your name here..."
            maxLength={20}
            className={nameError ? 'animate-shake' : ''}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.08)',
              border: `2px solid ${nameError ? 'var(--coral)' : 'rgba(100,150,255,0.3)'}`,
              color: 'white',
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--cyan-accent)'}
            onBlur={e => e.target.style.borderColor = 'rgba(100,150,255,0.3)'}
          />
        </div>

        {/* Avatar selection */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--star-yellow)',
          }}>
            🪐 Choose your avatar:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}>
            {AVATARS.map(av => (
              <button
                key={av.id}
                onClick={() => setSelectedAvatar(av)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedAvatar.id === av.id
                    ? 'rgba(34,211,238,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${selectedAvatar.id === av.id ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.1)'}`,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s',
                  transform: selectedAvatar.id === av.id ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <span style={{ fontSize: '28px' }}>{av.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{av.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Launch button */}
        <button
          onClick={handleGo}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
            color: '#1a0a00',
            fontSize: '20px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseDown={e => e.target.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.target.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          🚀 Blast Off!
        </button>

        {existingSave?.playerName && (
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', opacity: 0.5 }}>
            Your progress is saved automatically
          </p>
        )}
      </div>

      {/* Decorative planets */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        opacity: 0.4,
        pointerEvents: 'none',
      }}>
        {PLANETS.slice(0, 5).map(p => (
          <PlanetVisual key={p.id} planet={p} size={Math.max(12, Math.round(p.radius / 2000))} />
        ))}
      </div>
    </div>
  );
}
