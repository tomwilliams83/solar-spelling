import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_TYPES } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(planet) {
  const questions = [];
  const wordsArr = shuffle(planet.words);
  const sentArr = shuffle(planet.sentences);

  wordsArr.forEach((wordObj, i) => {
    if (i % 3 === 1) {
      const options = shuffle([wordObj.word, ...wordObj.distractors.slice(0, 3)]);
      questions.push({ type: QUESTION_TYPES.CHOOSE_SPELLING, word: wordObj.word, options });
    } else {
      questions.push({ type: QUESTION_TYPES.LISTEN_SPELL, word: wordObj.word });
    }
  });

  sentArr.slice(0, 3).forEach(s => {
    questions.push({ type: QUESTION_TYPES.FILL_BLANK, ...s });
  });

  return shuffle(questions);
}

const PRAISE = [
  '🎉 Fantastic!', '🌟 Amazing!', '🚀 Superstar!', '⭐ Brilliant!',
  '🎯 Spot on!', '🌈 Wonderful!', '💫 Out of this world!', '🏆 Excellent!',
];
function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

function speakWord(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  function doSpeak() {
    const voices = window.speechSynthesis.getVoices();
    // Prefer female British voice, then any female, then any British
    const voice =
      voices.find(v => v.lang === 'en-GB' && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang === 'en-GB' && (v.name.includes('Serena') || v.name.includes('Kate') || v.name.includes('Martha'))) ||
      voices.find(v => v.lang === 'en-GB') ||
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      null;

    function makeU(text) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.75;
      u.pitch = 1.3;
      u.volume = 1.0;
      u.lang = 'en-GB';
      if (voice) u.voice = voice;
      return u;
    }
    window.speechSynthesis.speak(makeU(word));
    window.speechSynthesis.speak(makeU(' '));
    window.speechSynthesis.speak(makeU(word));
  }

  // Voices may not be loaded yet
  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null; };
  }
}

function speakSentence(sentence) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en')) || null;
  const u = new SpeechSynthesisUtterance(sentence.replace('____', 'blank'));
  u.rate = 0.8;
  u.pitch = 1.2;
  u.volume = 1.0;
  u.lang = 'en-GB';
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

// ─── Single unified game question component ───────────────────────────────────

function Question({ q, onAnswer }) {
  const [typed, setTyped] = useState('');
  const [chosen, setChosen] = useState(null);
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
  const [praise, setPraise] = useState('');
  const inputRef = useRef();
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setTyped('');
    setChosen(null);
    setResult(null);
    setPraise('');
    if (q.type !== QUESTION_TYPES.FILL_BLANK) {
      setTimeout(() => speakWord(q.word), 400);
    } else {
      setTimeout(() => speakSentence(q.sentence), 400);
    }
    if (q.type !== QUESTION_TYPES.CHOOSE_SPELLING) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [q]);

  function submit(answer) {
    if (doneRef.current || result) return;
    const correct = answer.trim().toLowerCase() === (q.word || q.answer).toLowerCase();
    doneRef.current = true;
    setResult(correct ? 'correct' : 'wrong');
    setChosen(answer);
    if (correct) setPraise(pickPraise());
    if (q.type !== QUESTION_TYPES.FILL_BLANK) speakWord(q.word || q.answer);
    setTimeout(() => onAnswer(correct), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !result) submit(typed);
  }

  const inputStyle = {
    width: '100%',
    maxWidth: '300px',
    padding: '16px 20px',
    borderRadius: '16px',
    background: result === 'correct' ? 'rgba(74,222,128,0.15)' : result === 'wrong' ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.08)',
    border: `2px solid ${result === 'correct' ? 'var(--green-correct)' : result === 'wrong' ? 'var(--red-wrong)' : 'rgba(100,150,255,0.3)'}`,
    color: 'white',
    fontSize: '22px',
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    textAlign: 'center',
    letterSpacing: '2px',
    outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', width: '100%', maxWidth: '400px' }}>

      {/* Question type badge */}
      {q.type === QUESTION_TYPES.LISTEN_SPELL && (
        <div style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '16px', padding: '12px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>🎧 Listen & Spell</p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Listen to the word, then type it below</p>
        </div>
      )}
      {q.type === QUESTION_TYPES.CHOOSE_SPELLING && (
        <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '16px', padding: '12px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>🔤 Choose the Spelling</p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Which one is spelled correctly?</p>
        </div>
      )}
      {q.type === QUESTION_TYPES.FILL_BLANK && (
        <div style={{ background: 'rgba(255,232,124,0.08)', border: '1px solid rgba(255,232,124,0.25)', borderRadius: '16px', padding: '12px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>✏️ Fill the Gap</p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>Spell the missing word</p>
        </div>
      )}

      {/* Speaker button */}
      <button
        onClick={() => q.type === QUESTION_TYPES.FILL_BLANK ? speakSentence(q.sentence) : speakWord(q.word)}
        style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(168,85,247,0.3))',
          border: '2px solid var(--cyan-accent)', fontSize: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--cyan-accent)', animation: 'pulse-glow 2s ease-in-out infinite',
        }}
      >🔊</button>

      {/* Fill blank sentence display */}
      {q.type === QUESTION_TYPES.FILL_BLANK && (
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', padding: '14px 18px', textAlign: 'center',
          fontSize: '16px', fontWeight: 600, lineHeight: 1.8, maxWidth: '340px',
        }}>
          {q.sentence.split('____')[0]}
          <span style={{
            display: 'inline-block', minWidth: '80px',
            borderBottom: `3px solid ${result === 'correct' ? 'var(--green-correct)' : result === 'wrong' ? 'var(--red-wrong)' : 'var(--star-yellow)'}`,
            color: result === 'correct' ? 'var(--green-correct)' : result === 'wrong' ? 'var(--red-wrong)' : 'var(--star-yellow)',
            fontWeight: 800, letterSpacing: '2px', padding: '0 4px',
          }}>
            {result ? (result === 'correct' ? typed : q.answer) : (typed || ' ')}
          </span>
          {q.sentence.split('____')[1]}
        </div>
      )}

      {/* Choice buttons */}
      {q.type === QUESTION_TYPES.CHOOSE_SPELLING && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '360px' }}>
          {q.options.map((option, i) => {
            let bg = 'rgba(255,255,255,0.06)';
            let border = 'rgba(255,255,255,0.15)';
            if (chosen) {
              if (option === q.word) { bg = 'rgba(74,222,128,0.2)'; border = 'var(--green-correct)'; }
              else if (option === chosen) { bg = 'rgba(248,113,113,0.2)'; border = 'var(--red-wrong)'; }
            }
            return (
              <button key={i} onClick={() => submit(option)} style={{
                padding: '18px 12px', borderRadius: '16px', background: bg,
                border: `2px solid ${border}`, color: 'white', fontSize: '20px',
                fontWeight: 800, fontFamily: 'var(--font-body)', letterSpacing: '1px',
              }}>
                {option}
              </button>
            );
          })}
        </div>
      )}

      {/* Text input */}
      {q.type !== QUESTION_TYPES.CHOOSE_SPELLING && (
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={e => !result && setTyped(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!!result}
          placeholder="Type your answer..."
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          style={inputStyle}
        />
      )}

      {/* Feedback */}
      {result === 'correct' && (
        <div style={{
          textAlign: 'center', padding: '14px 28px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,211,238,0.1))',
          border: '2px solid var(--green-correct)',
        }}>
          <p style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--green-correct)' }}>{praise}</p>
        </div>
      )}
      {result === 'wrong' && (
        <div style={{
          textAlign: 'center', padding: '14px 28px', borderRadius: '16px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid var(--red-wrong)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Good try! The answer is:</p>
          <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--green-correct)', letterSpacing: '3px' }}>
            {q.word || q.answer}
          </p>
        </div>
      )}

      {/* Check button */}
      {q.type !== QUESTION_TYPES.CHOOSE_SPELLING && !result && (
        <button
          onClick={() => submit(typed)}
          disabled={!typed.trim()}
          style={{
            padding: '14px 40px', borderRadius: '24px',
            background: typed.trim() ? 'linear-gradient(135deg, #22c55e, #4ade80)' : 'rgba(255,255,255,0.1)',
            color: typed.trim() ? '#0a2010' : 'rgba(255,255,255,0.3)',
            fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-display)',
          }}
        >Check ✓</button>
      )}
    </div>
  );
}

// ─── Main Game Screen ─────────────────────────────────────────────────────────

export default function GameScreen({ planet, playerName, avatar, onComplete, onBack }) {
  const [questions] = useState(() => buildQuestions(planet));
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
        setTimeout(() => onComplete(planet.id, newScore, stars), 800);
      } else {
        setQIndex(q => q + 1);
      }
    }, 2000);
  }

  const currentQ = questions[qIndex];
  const progress = (qIndex + 1) / total;

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: '12px',
        background: 'linear-gradient(to bottom, rgba(4,4,20,0.95), transparent)', zIndex: 2, flexShrink: 0,
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
          <p style={{ marginTop: '4px', fontSize: '11px', opacity: 0.5 }}>Question {qIndex + 1} of {total}</p>
        </div>
      </div>

      {/* Question area */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
      }}>
        {finished ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--star-yellow)' }}>Level Complete!</p>
            <p style={{ opacity: 0.7, marginTop: '8px' }}>Loading your reward...</p>
          </div>
        ) : (
          <Question key={qIndex} q={currentQ} onAnswer={handleAnswer} />
        )}
      </div>
    </div>
  );
}
