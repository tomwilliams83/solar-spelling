import React, { useState } from 'react';
import { PLANETS } from '../data/levels.js';

const PORTAL_PIN = '1234'; // Simple PIN — parents can change this in the code

export default function ParentPortal({ completedLevels, focusWords, onSaveFocus, onClose }) {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0].id);
  const [localFocus, setLocalFocus] = useState(focusWords || {});
  const [saved, setSaved] = useState(false);

  function tryPin() {
    if (pin === PORTAL_PIN) {
      setUnlocked(true);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 800);
    }
  }

  function toggleWord(planetId, word) {
    setLocalFocus(prev => {
      const current = prev[planetId] || [];
      const next = current.includes(word)
        ? current.filter(w => w !== word)
        : [...current, word];
      return { ...prev, [planetId]: next };
    });
    setSaved(false);
  }

  function clearFocus(planetId) {
    setLocalFocus(prev => ({ ...prev, [planetId]: [] }));
    setSaved(false);
  }

  function saveAndClose() {
    onSaveFocus(localFocus);
    setSaved(true);
    setTimeout(onClose, 800);
  }

  const planet = PLANETS.find(p => p.id === selectedPlanet);
  const focusForPlanet = localFocus[selectedPlanet] || [];

  if (!unlocked) {
    return (
      <div style={overlay}>
        <div style={card}>
          <button onClick={onClose} style={closeBtn}>✕</button>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔒</div>
            <h2 style={heading}>Parent Portal</h2>
            <p style={sub}>Enter your PIN to access settings</p>
          </div>

          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && tryPin()}
            placeholder="Enter PIN"
            maxLength={6}
            style={{
              ...inputStyle,
              border: `2px solid ${pinError ? 'var(--red-wrong)' : 'rgba(100,150,255,0.3)'}`,
              animation: pinError ? 'shake 0.4s ease' : 'none',
            }}
          />
          {pinError && (
            <p style={{ color: 'var(--red-wrong)', fontSize: '13px', textAlign: 'center' }}>
              Incorrect PIN. Default PIN is 1234.
            </p>
          )}
          <button onClick={tryPin} style={primaryBtn}>Unlock →</button>
          <p style={{ fontSize: '11px', opacity: 0.4, textAlign: 'center', marginTop: '8px' }}>
            Default PIN: 1234 — change it in the code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <div style={{ ...card, maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={heading}>⚙️ Parent Portal</h2>
          <p style={sub}>Set focus words for each planet level</p>
        </div>

        {/* Progress summary */}
        <div style={section}>
          <h3 style={sectionTitle}>📊 Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {PLANETS.map(p => {
              const done = completedLevels[p.id];
              return (
                <div key={p.id} style={{
                  padding: '8px 12px', borderRadius: '10px',
                  background: done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '14px' }}>{done ? '✅' : '⭕'}</span>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700 }}>{p.name}</p>
                    {done && (
                      <p style={{ fontSize: '10px', opacity: 0.6 }}>
                        {[1,2,3].map(n => n <= done.stars ? '⭐' : '☆').join('')} {done.score} pts
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus word selector */}
        <div style={section}>
          <h3 style={sectionTitle}>🎯 Focus Words</h3>
          <p style={{ fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>
            Select specific words for your child to practise. Leave all unselected to use all words.
          </p>

          {/* Planet picker */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlanet(p.id)}
                style={{
                  padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                  background: selectedPlanet === p.id ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${selectedPlanet === p.id ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedPlanet === p.id ? 'var(--cyan-accent)' : 'white',
                }}
              >
                {p.name}
                {(localFocus[p.id] || []).length > 0 && (
                  <span style={{ marginLeft: '4px', color: 'var(--star-yellow)' }}>
                    ({localFocus[p.id].length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Word grid for selected planet */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--star-yellow)' }}>
                {planet.name} words
              </p>
              {focusForPlanet.length > 0 && (
                <button onClick={() => clearFocus(selectedPlanet)} style={{
                  fontSize: '11px', padding: '3px 8px', borderRadius: '10px',
                  background: 'rgba(248,113,113,0.15)', border: '1px solid var(--red-wrong)',
                  color: 'var(--red-wrong)',
                }}>
                  Clear all
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {planet.words.map(w => {
                const selected = focusForPlanet.includes(w.word);
                return (
                  <button
                    key={w.word}
                    onClick={() => toggleWord(selectedPlanet, w.word)}
                    style={{
                      padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                      background: selected ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${selected ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.1)'}`,
                      color: 'white', fontSize: '16px', fontWeight: 700,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span>{w.word}</span>
                    <span style={{ fontSize: '14px' }}>{selected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {focusForPlanet.length > 0 && (
            <p style={{ fontSize: '12px', opacity: 0.6, textAlign: 'center' }}>
              {focusForPlanet.length} word{focusForPlanet.length !== 1 ? 's' : ''} selected for {planet.name}
            </p>
          )}
        </div>

        <button onClick={saveAndClose} style={{ ...primaryBtn, background: saved ? 'rgba(74,222,128,0.3)' : undefined }}>
          {saved ? '✓ Saved!' : 'Save & Close'}
        </button>
      </div>
    </div>
  );
}

// Styles
const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 100, padding: '20px',
};
const card = {
  background: 'rgba(10,20,60,0.97)', border: '1px solid rgba(100,150,255,0.2)',
  borderRadius: '28px', padding: '28px 24px', width: '100%', maxWidth: '420px',
  backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,20,0.9)',
  position: 'relative',
};
const closeBtn = {
  position: 'absolute', top: '16px', right: '16px',
  width: '32px', height: '32px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
  color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const heading = {
  fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800,
  color: 'var(--star-yellow)', marginBottom: '4px',
};
const sub = { fontSize: '13px', opacity: 0.6 };
const inputStyle = {
  width: '100%', padding: '14px 18px', borderRadius: '14px',
  background: 'rgba(255,255,255,0.08)', color: 'white',
  fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-body)',
  textAlign: 'center', letterSpacing: '4px', outline: 'none', marginBottom: '12px',
};
const primaryBtn = {
  width: '100%', padding: '15px', borderRadius: '20px', marginTop: '8px',
  background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
  color: '#1a0a00', fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)',
};
const section = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px', padding: '16px', marginBottom: '16px',
};
const sectionTitle = {
  fontSize: '14px', fontWeight: 800, color: 'var(--cyan-accent)',
  marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px',
};
