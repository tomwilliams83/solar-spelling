import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_TYPES } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(planet, focusWords) {
  // Use focusWords if provided (from parent portal), else use all planet words
  const wordPool = focusWords && focusWords.length > 0
    ? planet.words.filter(w => focusWords.includes(w.word))
    : planet.words;

  const wordsArr = shuffle(wordPool.length > 0 ? wordPool : planet.words);
  const questions = [];

  wordsArr.forEach((wordObj, i) => {
    const type = i % 3 === 0
      ? QUESTION_TYPES.LISTEN_SPELL
      : i % 3 === 1
      ? QUESTION_TYPES.CHOOSE_SPELLING
      : QUESTION_TYPES.LOOK_COVER;

    if (type === QUESTION_TYPES.CHOOSE_SPELLING) {
      const options = shuffle([wordObj.word, ...wordObj.distractors.slice(0, 3)]);
      questions.push({ type, word: wordObj.word, options });
    } else {
      questions.push({ type, word: wordObj.word });
    }
  });

  return shuffle(questions);
}

const PRAISE = [
  '🎉 Fantastic!', '🌟 Amazing!', '🚀 Superstar!', '⭐ Brilliant!',
  '🎯 Spot on!', '🌈 Wonderful!', '💫 Out of this world!', '🏆 Excellent!',
  '🪐 Stellar!', '☄️ Incredible!',
];
function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

// ─── Speech ───────────────────────────────────────────────────────────────────

function speakWord(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  function doSpeak() {
    const voices = window.speechSynthesis.getVoices();
    // Log for debugging
    console.log('Voices:', voices.map(v => `${v.name} [${v.lang}]`).join(', '));

    const voice =
      voices.find(v => v.name.includes('Hazel')) ||
      voices.find(v => v.name.includes('Zira')) ||
      voices.find(v => v.name.includes('Susan')) ||
      voices.find(v => v.name.includes('Serena')) ||
      voices.find(v => v.name.includes('Karen')) ||
      voices.find(v => v.lang === 'en-GB') ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;

    console.log('Chosen voice:', voice ? voice.name : 'browser default');

    function u(text) {
      const ut = new SpeechSynthesisUtterance(text);
      ut.rate = 0.7;
      ut.pitch = 1.6;  // High pitch sounds more child-friendly
      ut.volume = 1.0;
      ut.lang = 'en-GB';
      if (voice) ut.voice = voice;
      return ut;
    }
    // Say word, pause, say again
    window.speechSynthesis.speak(u(word));
    window.speechSynthesis.speak(u('...'));
    window.speechSynthesis.speak(u(word));
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      doSpeak();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }
}

// ─── Question types ───────────────────────────────────────────────────────────

// 1. Listen & Spell
function ListenSpell({ word, onDone }) {
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null);
  const [praise, setPraise] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => speakWord(word), 300);
    setTimeout(() => inputRef.current?.focus(), 400);
  }, [word]);

  function submit() {
    if (result || !typed.trim()) return;
    const correct = typed.trim().toLowerCase() === word.toLowerCase();
    setResult(correct ? 'correct' : 'wrong');
    if (correct) setPraise(pickPraise());
    speakWord(word);
    setTimeout(() => onDone(correct), 2000);
  }

  return (
    <div style={styles.qWrap}>
      <div style={styles.badge('#22d3ee')}>
        <p style={styles.badgeLabel}>🎧 Listen & Spell</p>
        <p style={styles.badgeSub}>Listen to the word, then type it below</p>
      </div>

      <button onClick={() => speakWord(word)} style={styles.speakBtn}>🔊</button>

      <input
        ref={inputRef}
        value={typed}
        onChange={e => !result && setTyped(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        disabled={!!result}
        placeholder="Type the word..."
        autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck="false"
        style={styles.input(result)}
      />

      {!result && (
        <button onClick={submit} disabled={!typed.trim()} style={styles.checkBtn(!!typed.trim())}>
          Check ✓
        </button>
      )}

      {result && <Feedback result={result} praise={praise} word={word} />}
    </div>
  );
}

// 2. Choose Spelling
function ChooseSpelling({ word, options, onDone }) {
  const [chosen, setChosen] = useState(null);
  const [praise, setPraise] = useState('');

  useEffect(() => {
    setTimeout(() => speakWord(word), 300);
  }, [word]);

  function choose(option) {
    if (chosen) return;
    const correct = option === word;
    setChosen(option);
    if (correct) setPraise(pickPraise());
    speakWord(word);
    setTimeout(() => onDone(correct), 2000);
  }

  return (
    <div style={styles.qWrap}>
      <div style={styles.badge('#a855f7')}>
        <p style={styles.badgeLabel}>🔤 Choose the Spelling</p>
        <p style={styles.badgeSub}>Which one is spelled correctly?</p>
      </div>

      <button onClick={() => speakWord(word)} style={styles.speakBtn}>🔊</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '360px' }}>
        {options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.06)';
          let border = 'rgba(255,255,255,0.15)';
          if (chosen) {
            if (opt === word) { bg = 'rgba(74,222,128,0.2)'; border = 'var(--green-correct)'; }
            else if (opt === chosen) { bg = 'rgba(248,113,113,0.2)'; border = 'var(--red-wrong)'; }
          }
          return (
            <button key={i} onClick={() => choose(opt)} style={{
              padding: '18px 12px', borderRadius: '16px', background: bg,
              border: `2px solid ${border}`, color: 'white', fontSize: '20px',
              fontWeight: 800, fontFamily: 'var(--font-body)', letterSpacing: '1px',
              transition: 'all 0.15s',
            }}>{opt}</button>
          );
        })}
      </div>

      {chosen && <Feedback result={chosen === word ? 'correct' : 'wrong'} praise={praise} word={word} />}
    </div>
  );
}

// 3. Look, Cover, Write, Check
function LookCoverWrite({ word, onDone }) {
  const LOOK_SECS = 5;
  const [phase, setPhase] = useState('look'); // look | write | done
  const [countdown, setCountdown] = useState(LOOK_SECS);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null);
  const [praise, setPraise] = useState('');
  const inputRef = useRef();
  const timerRef = useRef();

  useEffect(() => {
    speakWord(word);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setPhase('write');
          setTimeout(() => inputRef.current?.focus(), 100);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [word]);

  function submit() {
    if (result || !typed.trim()) return;
    const correct = typed.trim().toLowerCase() === word.toLowerCase();
    setResult(correct ? 'correct' : 'wrong');
    setPhase('done');
    if (correct) setPraise(pickPraise());
    speakWord(word);
    setTimeout(() => onDone(correct), 2500);
  }

  return (
    <div style={styles.qWrap}>
      <div style={styles.badge('#f59e0b')}>
        <p style={styles.badgeLabel}>👀 Look, Cover, Write, Check</p>
        <p style={styles.badgeSub}>
          {phase === 'look' ? `Study the word — it disappears in ${countdown}s!` :
           phase === 'write' ? 'Now spell it from memory!' :
           'Here\'s how you did:'}
        </p>
      </div>

      {/* The word — visible during look, hidden during write */}
      <div style={{
        fontSize: '48px', fontWeight: 900, fontFamily: 'var(--font-display)',
        letterSpacing: '6px', color: 'var(--star-yellow)',
        textShadow: '0 0 20px rgba(255,232,124,0.5)',
        minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        filter: phase === 'write' ? 'blur(12px)' : 'none',
        userSelect: 'none',
        transition: 'filter 0.5s',
        position: 'relative',
      }}>
        {word}
        {/* Countdown ring */}
        {phase === 'look' && (
          <div style={{
            position: 'absolute', right: '-48px', top: '50%', transform: 'translateY(-50%)',
            width: '36px', height: '36px', borderRadius: '50%',
            background: `conic-gradient(var(--star-yellow) ${(countdown/LOOK_SECS)*100}%, rgba(255,255,255,0.1) 0%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--space-dark)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--star-yellow)',
            }}>{countdown}</div>
          </div>
        )}
      </div>

      {/* Input — shown during write and done phases */}
      {phase !== 'look' && (
        <input
          ref={inputRef}
          value={typed}
          onChange={e => !result && setTyped(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          disabled={!!result}
          placeholder="Spell it from memory..."
          autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck="false"
          style={styles.input(result)}
        />
      )}

      {phase === 'write' && !result && (
        <button onClick={submit} disabled={!typed.trim()} style={styles.checkBtn(!!typed.trim())}>
          Check ✓
        </button>
      )}

      {result && <Feedback result={result} praise={praise} word={word} />}
    </div>
  );
}

// ─── Shared feedback component ────────────────────────────────────────────────

function Feedback({ result, praise, word }) {
  if (result === 'correct') return (
    <div style={{
      textAlign: 'center', padding: '14px 28px', borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,211,238,0.1))',
      border: '2px solid var(--green-correct)',
    }}>
      <p style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green-correct)' }}>
        {praise}
      </p>
    </div>
  );
  return (
    <div style={{
      textAlign: 'center', padding: '14px 28px', borderRadius: '16px',
      background: 'rgba(248,113,113,0.1)', border: '1px solid var(--red-wrong)',
    }}>
      <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '6px' }}>Good try! The answer is:</p>
      <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green-correct)', letterSpacing: '4px' }}>{word}</p>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const styles = {
  qWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '18px', width: '100%', maxWidth: '400px',
  },
  badge: (colour) => ({
    background: `${colour}18`, border: `1px solid ${colour}44`,
    borderRadius: '16px', padding: '12px 24px', textAlign: 'center', width: '100%',
  }),
  badgeLabel: { fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' },
  badgeSub: { fontSize: '14px', opacity: 0.85 },
  speakBtn: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(34,211,238,0.25), rgba(168,85,247,0.25))',
    border: '2px solid var(--cyan-accent)', fontSize: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--cyan-accent)', animation: 'pulse-glow 2s ease-in-out infinite',
  },
  input: (result) => ({
    width: '100%', maxWidth: '300px', padding: '16px 20px', borderRadius: '16px',
    background: result === 'correct' ? 'rgba(74,222,128,0.15)' : result === 'wrong' ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.08)',
    border: `2px solid ${result === 'correct' ? 'var(--green-correct)' : result === 'wrong' ? 'var(--red-wrong)' : 'rgba(100,150,255,0.3)'}`,
    color: 'white', fontSize: '22px', fontWeight: 700,
    fontFamily: 'var(--font-body)', textAlign: 'center', letterSpacing: '2px', outline: 'none',
  }),
  checkBtn: (active) => ({
    padding: '14px 40px', borderRadius: '24px',
    background: active ? 'linear-gradient(135deg, #22c55e, #4ade80)' : 'rgba(255,255,255,0.1)',
    color: active ? '#0a2010' : 'rgba(255,255,255,0.3)',
    fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)',
  }),
};

// ─── Main Game Screen ─────────────────────────────────────────────────────────

export default function GameScreen({ planet, playerName, avatar, onComplete, onBack, focusWords }) {
  const [questions] = useState(() => buildQuestions(planet, focusWords));
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const total = questions.length;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleAnswer(isCorrect) {
    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (qIndex + 1 >= total) {
        setFinished(true);
        const pct = (newScore / total) * 100;
        const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
        setTimeout(() => onComplete(planet.id, newScore, stars), 1000);
      } else {
        setQIndex(q => q + 1);
      }
    }, 2200);
  }

  const q = questions[qIndex];
  const progress = (qIndex + 1) / total;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: '12px',
        background: 'linear-gradient(to bottom, rgba(4,4,20,0.95), transparent)',
        zIndex: 2, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>←</button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <PlanetVisual planet={planet} size={24} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--star-yellow)' }}>
              {planet.name}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 700, color: 'var(--cyan-accent)' }}>
              {avatar.emoji} {score}/{qIndex}
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              background: 'linear-gradient(to right, var(--cyan-accent), var(--star-yellow))',
              width: `${progress * 100}%`, transition: 'width 0.4s ease',
            }} />
          </div>
          <p style={{ marginTop: '4px', fontSize: '11px', opacity: 0.5 }}>
            Question {qIndex + 1} of {total}
          </p>
        </div>
      </div>

      {/* Question */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
      }}>
        {finished ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--star-yellow)' }}>
              Level Complete!
            </p>
          </div>
        ) : (
          <>
            {q.type === QUESTION_TYPES.LISTEN_SPELL && (
              <ListenSpell key={`ls-${qIndex}`} word={q.word} onDone={handleAnswer} />
            )}
            {q.type === QUESTION_TYPES.CHOOSE_SPELLING && (
              <ChooseSpelling key={`cs-${qIndex}`} word={q.word} options={q.options} onDone={handleAnswer} />
            )}
            {q.type === QUESTION_TYPES.LOOK_COVER && (
              <LookCoverWrite key={`lc-${qIndex}`} word={q.word} onDone={handleAnswer} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
