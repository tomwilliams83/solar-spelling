import React, { useState } from 'react';
import { PLANETS } from '../data/levels.js';

export default function ParentPortal({ completedLevels, focusWords, onSaveFocus, onClose }) {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0].id);
  const [localFocus, setLocalFocus] = useState(focusWords || {});
  const [inputVal, setInputVal] = useState('');
  const [saved, setSaved] = useState(false);

  const planet = PLANETS.find(p => p.id === selectedPlanet);
  const wordsForPlanet = localFocus[selectedPlanet] || [];

  function addWord() {
    const word = inputVal.trim().toLowerCase();
    if (!word) return;
    if (wordsForPlanet.includes(word)) { setInputVal(''); return; }
    setLocalFocus(prev => ({
      ...prev,
      [selectedPlanet]: [...(prev[selectedPlanet] || []), word],
    }));
    setInputVal('');
    setSaved(false);
  }

  function removeWord(word) {
    setLocalFocus(prev => ({
      ...prev,
      [selectedPlanet]: (prev[selectedPlanet] || []).filter(w => w !== word),
    }));
    setSaved(false);
  }

  function clearAll() {
    setLocalFocus(prev => ({ ...prev, [selectedPlanet]: [] }));
    setSaved(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addWord();
  }

  function saveAndClose() {
    onSaveFocus(localFocus);
    setSaved(true);
    setTimeout(onClose, 600);
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={heading}>⚙️ Parent Portal</h2>
          <p style={sub}>Add this week's spellings for any planet level</p>
        </div>

        {/* Progress summary */}
        <div style={section}>
          <h3 style={sectionTitle}>📊 Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {PLANETS.map(p => {
              const done = completedLevels[p.id];
              const hasFocus = (localFocus[p.id] || []).length > 0;
              return (
                <div key={p.id} style={{
                  padding: '7px 10px', borderRadius: '10px',
                  background: done ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${done ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', gap: '7px',
                }}>
                  <span style={{ fontSize: '13px' }}>{done ? '✅' : '⭕'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                      {hasFocus && <span style={{ color: 'var(--star-yellow)', marginLeft: '4px' }}>★</span>}
                    </p>
                    {done && (
                      <p style={{ fontSize: '10px', opacity: 0.5 }}>
                        {'⭐'.repeat(done.stars)} {done.score} pts
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus word editor */}
        <div style={section}>
          <h3 style={sectionTitle}>✏️ Focus Words</h3>
          <p style={{ fontSize: '12px', opacity: 0.6, marginBottom: '12px', lineHeight: 1.5 }}>
            Choose a planet level, then type in words to focus on — great for this week's class spellings!
            Leave empty to use all words for that level.
          </p>

          {/* Planet tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
            {PLANETS.map(p => {
              const count = (localFocus[p.id] || []).length;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanet(p.id)}
                  style={{
                    padding: '5px 11px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                    background: selectedPlanet === p.id ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedPlanet === p.id ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.1)'}`,
                    color: selectedPlanet === p.id ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {p.name}{count > 0 ? ` (${count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Word input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Add a word for ${planet.name}...`}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              style={{
                flex: 1, padding: '12px 14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid rgba(100,150,255,0.3)',
                color: 'white', fontSize: '16px', fontWeight: 700,
                fontFamily: 'var(--font-body)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--cyan-accent)'}
              onBlur={e => e.target.style.borderColor = 'rgba(100,150,255,0.3)'}
            />
            <button
              onClick={addWord}
              disabled={!inputVal.trim()}
              style={{
                padding: '12px 18px', borderRadius: '12px', fontSize: '20px',
                background: inputVal.trim() ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${inputVal.trim() ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.1)'}`,
                color: inputVal.trim() ? 'var(--cyan-accent)' : 'rgba(255,255,255,0.3)',
              }}
            >+</button>
          </div>

          {/* Word chips */}
          {wordsForPlanet.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {wordsForPlanet.map(word => (
                  <div key={word} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 12px', borderRadius: '20px',
                    background: 'rgba(34,211,238,0.12)',
                    border: '1px solid rgba(34,211,238,0.3)',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{word}</span>
                    <button
                      onClick={() => removeWord(word)}
                      style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'rgba(248,113,113,0.3)', border: 'none',
                        color: 'var(--red-wrong)', fontSize: '11px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        lineHeight: 1, cursor: 'pointer',
                      }}
                    >✕</button>
                  </div>
                ))}
              </div>
              <button onClick={clearAll} style={{
                fontSize: '12px', padding: '4px 10px', borderRadius: '10px',
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                color: 'var(--red-wrong)', marginBottom: '4px',
              }}>
                Clear all {planet.name} words
              </button>
            </>
          ) : (
            <p style={{ fontSize: '12px', opacity: 0.4, textAlign: 'center', padding: '8px 0' }}>
              No focus words set — all {planet.name} words will be used
            </p>
          )}
        </div>

        <button onClick={saveAndClose} style={{
          width: '100%', padding: '15px', borderRadius: '20px',
          background: saved ? 'rgba(74,222,128,0.3)' : 'linear-gradient(135deg, #f59e0b, #fcd34d)',
          color: saved ? 'var(--green-correct)' : '#1a0a00',
          fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)',
          border: saved ? '2px solid var(--green-correct)' : 'none',
        }}>
          {saved ? '✓ Saved!' : 'Save & Close'}
        </button>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 100, padding: '16px',
};
const card = {
  background: 'rgba(10,20,60,0.97)', border: '1px solid rgba(100,150,255,0.2)',
  borderRadius: '28px', padding: '24px 20px', width: '100%', maxWidth: '420px',
  maxHeight: '92vh', overflowY: 'auto',
  backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,20,0.9)',
  position: 'relative',
};
const closeBtn = {
  position: 'absolute', top: '16px', right: '16px',
  width: '32px', height: '32px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
  color: 'white', fontSize: '14px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const heading = {
  fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800,
  color: 'var(--star-yellow)', marginBottom: '4px',
};
const sub = { fontSize: '13px', opacity: 0.6 };
const section = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px', padding: '14px', marginBottom: '14px',
};
const sectionTitle = {
  fontSize: '13px', fontWeight: 800, color: 'var(--cyan-accent)',
  marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
};
