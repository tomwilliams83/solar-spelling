import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PLANETS, QUESTION_TYPES } from '../data/levels.js';
import { PlanetVisual } from './PlanetVisual.js';

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

  // Mix all three types
  wordsArr.forEach((wordObj, i) => {
    const type = i % 3 === 0
      ? QUESTION_TYPES.LISTEN_SPELL
      : i % 3 === 1
      ? QUESTION_TYPES.CHOOSE_SPELLING
      : QUESTION_TYPES.LISTEN_SPELL;

    if (type === QUESTION_TYPES.CHOOSE_SPELLING) {
      const options = shuffle([wordObj.word, ...wordObj.distractors.slice(0, 3)]);
      questions.push({ type, word: wordObj.word, options });
    } else {
      questions.push({ type: QUESTION_TYPES.LISTEN_SPELL, word: wordObj.word });
    }
  });

  // Add fill-in sentences
  sentArr.slice(0, 3).forEach(s => {
    questions.push({ type: QUESTION_TYPES.FILL_BLANK, ...s });
  });

  return shuffle(questions);
}

function getGBVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en')) || null;
}

function speak(text, rate = 0.65) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-GB';
  const voice = getGBVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function speakWord(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voice = getGBVoice();
  function makeU(text, rate) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate; u.pitch = 1.0; u.volume = 1.0; u.lang = "en-GB";
    if (voice) u.voice = voice;
    return u;
  }
  window.speechSynthesis.speak(makeU(word, 0.5));
  window.speechSynthesis.speak(makeU(" ", 0.1));
  window.speechSynthesis.speak(makeU(word, 0.5));
}

// ─── Question components ──────────────────────────────────────────────────────

function ListenSpell({ question, onAnswer }) {
  const [typed, setTyped] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    setTyped('');
    setSubmitted(false);
    setCorrect(null);
    setTimeout(() => {
      speakWord(question.word);
      inputRef.current?.focus();
    }, 300);
  }, [question]);

  function handleSubmit() {
    if (!typed.trim()) return;
    const isCorrect = typed.trim().toLowerCase() === question.word.toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);
    if (isCorrect) speak(pickPraise(), 1.0);
    else speak(`Never mind! The correct spelling is: ${question.word}`, 0.75);
    setTimeout(() => onAnswer(isCorrect), 1600);
  }

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{
        background: 'rgba(34,211,238,0.1)',
        border: '1px solid rgba(34,211,238,0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 28px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>🎧 Listen & Spell</p>
        <p style={{ fontSize: '15px', opacity: 0.8 }}>Listen to the word, then type it below</p>
      </div>

      <button
        onClick={() => speakWord(question.word)}
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(168,85,247,0.3))',
          border: '2px solid var(--cyan-accent)',
          fontSize: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse-glow 2s ease-in-out infinite',
          color: 'var(--cyan-accent)',
          transition: 'transform 0.1s',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
        onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; speakWord(question.word); }}
      >
        🔊
      </button>

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={e => setTyped(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !submitted && handleSubmit()}
        disabled={submitted}
        placeholder="Type your answer..."
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: submitted
            ? correct
              ? 'rgba(74,222,128,0.15)'
              : 'rgba(248,113,113,0.15)'
            : 'rgba(255,255,255,0.08)',
          border: `2px solid ${submitted ? (correct ? 'var(--green-correct)' : 'var(--red-wrong)') : 'rgba(100,150,255,0.3)'}`,
          color: 'white',
          fontSize: '22px',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          textAlign: 'center',
          letterSpacing: '2px',
          transition: 'all 0.2s',
          className: submitted && !correct ? 'animate-shake' : '',
        }}
      />

      {submitted && !correct && (
        <div className="animate-bounce-in" style={{
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid var(--red-wrong)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 20px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>The correct spelling is:</p>
          <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-correct)', letterSpacing: '3px' }}>
            {question.word}
          </p>
        </div>
      )}

      {submitted && correct && (
        <div className="animate-bounce-in" style={{ fontSize: '40px' }}>🎉</div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!typed.trim()}
          style={{
            padding: '14px 40px',
            borderRadius: 'var(--radius-lg)',
            background: typed.trim() ? 'linear-gradient(135deg, #22c55e, #4ade80)' : 'rgba(255,255,255,0.1)',
            color: typed.trim() ? '#0a2010' : 'rgba(255,255,255,0.3)',
            fontSize: '17px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s',
          }}
        >
          Check ✓
        </button>
      )}
    </div>
  );
}

function ChooseSpelling({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(null);

  useEffect(() => {
    setSelected(null);
    setCorrect(null);
    setTimeout(() => speak('Which one is spelled correctly? Listen carefully!', 0.75), 200);
  }, [question]);

  function handleChoice(option) {
    if (selected) return;
    const isCorrect = option === question.word;
    setSelected(option);
    setCorrect(isCorrect);
    if (isCorrect) speak(pickPraise(), 1.0);
    else speak(`Nearly! The correct spelling is: ${question.word}`, 0.75);
    setTimeout(() => onAnswer(isCorrect), 1600);
  }

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{
        background: 'rgba(168,85,247,0.1)',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 28px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>🔤 Choose the Spelling</p>
        <p style={{ fontSize: '15px', opacity: 0.8 }}>Which one is spelled correctly?</p>
      </div>

      <button
        onClick={() => speakWord(question.word)}
        style={{
          padding: '10px 24px',
          borderRadius: '40px',
          background: 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.4)',
          color: 'var(--purple-accent)',
          fontSize: '15px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🔊</span> Hear the word
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        width: '100%',
        maxWidth: '360px',
      }}>
        {question.options.map((option, i) => {
          let bg = 'rgba(255,255,255,0.06)';
          let border = 'rgba(255,255,255,0.15)';
          if (selected === option) {
            bg = correct ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)';
            border = correct ? 'var(--green-correct)' : 'var(--red-wrong)';
          } else if (selected && option === question.word) {
            bg = 'rgba(74,222,128,0.15)';
            border = 'var(--green-correct)';
          }
          return (
            <button
              key={i}
              onClick={() => handleChoice(option)}
              style={{
                padding: '18px 12px',
                borderRadius: 'var(--radius-md)',
                background: bg,
                border: `2px solid ${border}`,
                color: 'white',
                fontSize: '20px',
                fontWeight: 800,
                fontFamily: 'var(--font-body)',
                letterSpacing: '1px',
                transition: 'all 0.15s',
                transform: selected === option ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillBlank({ question, onAnswer }) {
  const [typed, setTyped] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    setTyped('');
    setSubmitted(false);
    setCorrect(null);
    const text = question.sentence.replace('____', '____');
    setTimeout(() => { speak(text.replace('____', 'blank'), 0.85); inputRef.current?.focus(); }, 300);
  }, [question]);

  function handleSubmit() {
    if (!typed.trim()) return;
    const isCorrect = typed.trim().toLowerCase() === question.answer.toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);
    const filled = question.sentence.replace('____', question.answer);
    if (isCorrect) speak(pickPraise() + '... ' + filled, 1.0);
    else speak(`Good try! The missing word is: ${question.answer}`, 0.75);
    setTimeout(() => onAnswer(isCorrect), 1600);
  }

  const parts = question.sentence.split('____');

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{
        background: 'rgba(255,232,124,0.08)',
        border: '1px solid rgba(255,232,124,0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 28px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>✏️ Fill the Gap</p>
        <p style={{ fontSize: '15px', opacity: 0.8 }}>Spell the missing word</p>
      </div>

      <button
        onClick={() => speak(question.sentence.replace('____', 'blank'), 0.85)}
        style={{
          padding: '10px 24px',
          borderRadius: '40px',
          background: 'rgba(255,232,124,0.1)',
          border: '1px solid rgba(255,232,124,0.3)',
          color: 'var(--star-yellow)',
          fontSize: '15px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🔊</span> Hear the sentence
      </button>

      {/* Sentence display */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: '17px',
        fontWeight: 600,
        lineHeight: 1.8,
        maxWidth: '340px',
      }}>
        {parts[0]}
        <span style={{
          display: 'inline-block',
          minWidth: '80px',
          borderBottom: `3px solid ${submitted ? (correct ? 'var(--green-correct)' : 'var(--red-wrong)') : 'var(--star-yellow)'}`,
          color: submitted ? (correct ? 'var(--green-correct)' : 'var(--red-wrong)') : 'var(--star-yellow)',
          fontWeight: 800,
          letterSpacing: '2px',
          padding: '0 4px',
          transition: 'all 0.2s',
        }}>
          {submitted ? (correct ? typed : question.answer) : typed || ' '}
        </span>
        {parts[1]}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={e => setTyped(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !submitted && handleSubmit()}
        disabled={submitted}
        placeholder="Type the missing word..."
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        style={{
          width: '100%',
          maxWidth: '280px',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.06)',
          border: `2px solid rgba(255,232,124,0.3)`,
          color: 'white',
          fontSize: '20px',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          textAlign: 'center',
          letterSpacing: '2px',
        }}
      />

      {submitted && !correct && (
        <div className="animate-bounce-in" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', opacity: 0.7 }}>The missing word was:</p>
          <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green-correct)', letterSpacing: '2px' }}>
            {question.answer}
          </p>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!typed.trim()}
          style={{
            padding: '14px 40px',
            borderRadius: 'var(--radius-lg)',
            background: typed.trim() ? 'linear-gradient(135deg, var(--star-yellow), #f59e0b)' : 'rgba(255,255,255,0.1)',
            color: typed.trim() ? '#1a0a00' : 'rgba(255,255,255,0.3)',
            fontSize: '17px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s',
          }}
        >
          Check ✓
        </button>
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

  const total = questions.length;

  function handleAnswer(isCorrect) {
    if (isCorrect) setScore(s => s + 1);
    if (qIndex + 1 >= total) {
      setFinished(true);
      const finalScore = isCorrect ? score + 1 : score;
      const pct = (finalScore / total) * 100;
      const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
      setTimeout(() => onComplete(planet.id, finalScore, stars), 800);
    } else {
      setQIndex(i => i + 1);
    }
  }

  const currentQ = questions[qIndex];
  const progress = qIndex / total;

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
        gap: '12px',
        background: 'linear-gradient(to bottom, rgba(4,4,20,0.95), transparent)',
        zIndex: 2,
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <PlanetVisual planet={planet} size={24} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '16px',
              color: 'var(--star-yellow)',
            }}>
              {planet.name}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 700, color: 'var(--cyan-accent)' }}>
              {avatar.emoji} {score}/{qIndex}
            </span>
          </div>
          {/* Progress bar */}
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
              width: `${progress * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <p style={{ marginTop: '4px', fontSize: '11px', opacity: 0.5 }}>
            Question {qIndex + 1} of {total}
          </p>
        </div>
      </div>

      {/* Question area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        gap: '0',
      }}>
        {finished ? (
          <div className="animate-bounce-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--star-yellow)' }}>
              Level Complete!
            </p>
            <p style={{ opacity: 0.7, marginTop: '8px' }}>Loading your reward...</p>
          </div>
        ) : (
          <>
            {currentQ.type === QUESTION_TYPES.LISTEN_SPELL && (
              <ListenSpell key={qIndex} question={currentQ} onAnswer={handleAnswer} />
            )}
            {currentQ.type === QUESTION_TYPES.CHOOSE_SPELLING && (
              <ChooseSpelling key={qIndex} question={currentQ} onAnswer={handleAnswer} />
            )}
            {currentQ.type === QUESTION_TYPES.FILL_BLANK && (
              <FillBlank key={qIndex} question={currentQ} onAnswer={handleAnswer} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
