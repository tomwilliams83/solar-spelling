import React, { useState, useEffect, useCallback } from 'react';
import { PLANETS, AVATARS } from './data/levels.js';
import StarField from './components/StarField.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import SolarMap from './components/SolarMap.jsx';
import GameScreen from './components/GameScreen.jsx';
import FactsScreen from './components/FactsScreen.jsx';
import TravelScreen from './components/TravelScreen.jsx';
import ParentPortal from './components/ParentPortal.jsx';

const STORAGE_KEY = 'solar-spelling-save';

function loadSave() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return null;
}
function writeSave(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [completedLevels, setCompletedLevels] = useState({});
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [travelFrom, setTravelFrom] = useState(null);
  const [travelTo, setTravelTo] = useState(null);
  const [gameScore, setGameScore] = useState(null);
  const [showPortal, setShowPortal] = useState(false);
  const [focusWords, setFocusWords] = useState({});

  useEffect(() => {
    const save = loadSave();
    if (save) {
      setPlayerName(save.playerName || '');
      setAvatar(AVATARS.find(a => a.id === save.avatarId) || AVATARS[0]);
      setCompletedLevels(save.completedLevels || {});
      setFocusWords(save.focusWords || {});
      if (save.playerName) setScreen('map');
    }
  }, []);

  const handleStart = useCallback((name, selectedAvatar) => {
    setPlayerName(name);
    setAvatar(selectedAvatar);
    const save = loadSave() || {};
    writeSave({ ...save, playerName: name, avatarId: selectedAvatar.id, completedLevels: save.completedLevels || {} });
    setScreen('map');
  }, []);

  const handleSelectPlanet = useCallback((planet) => {
    setCurrentPlanet(planet);
    setScreen('game');
  }, []);

  const handleGameComplete = useCallback((planetId, score, stars) => {
    const prev = loadSave() || {};
    const updated = { ...prev.completedLevels, [planetId]: { score, stars } };
    setCompletedLevels(updated);
    writeSave({ ...prev, completedLevels: updated });
    setGameScore({ score, stars });
    setScreen('facts');
  }, []);

  const handleFactsDone = useCallback(() => {
    const idx = PLANETS.findIndex(p => p.id === currentPlanet.id);
    const next = PLANETS[idx + 1];
    if (next) { setTravelFrom(currentPlanet); setTravelTo(next); setScreen('travel'); }
    else setScreen('map');
  }, [currentPlanet]);

  const handleTravelDone = useCallback(() => { setCurrentPlanet(null); setScreen('map'); }, []);
  const handleBackToMap = useCallback(() => { setCurrentPlanet(null); setScreen('map'); }, []);

  const handleSaveFocus = useCallback((newFocus) => {
    setFocusWords(newFocus);
    const prev = loadSave() || {};
    writeSave({ ...prev, focusWords: newFocus });
  }, []);

  const highestUnlocked = PLANETS.findIndex(p => !completedLevels[p.id]);
  const unlockedIndex = highestUnlocked === -1 ? PLANETS.length - 1 : highestUnlocked;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--space-dark)' }}>
      <StarField />

      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} existingSave={loadSave()} />}

      {screen === 'map' && (
        <SolarMap
          playerName={playerName}
          avatar={avatar}
          completedLevels={completedLevels}
          unlockedIndex={unlockedIndex}
          onSelectPlanet={handleSelectPlanet}
          onEditProfile={() => setScreen('welcome')}
          onParentPortal={() => setShowPortal(true)}
        />
      )}

      {screen === 'game' && currentPlanet && (
        <GameScreen
          planet={currentPlanet}
          playerName={playerName}
          avatar={avatar}
          onComplete={handleGameComplete}
          onBack={handleBackToMap}
          focusWords={focusWords[currentPlanet.id] || []}
        />
      )}

      {screen === 'facts' && currentPlanet && (
        <FactsScreen planet={currentPlanet} score={gameScore} avatar={avatar}
          playerName={playerName} onContinue={handleFactsDone} />
      )}

      {screen === 'travel' && (
        <TravelScreen from={travelFrom} to={travelTo} onDone={handleTravelDone} />
      )}

      {showPortal && (
        <ParentPortal
          completedLevels={completedLevels}
          focusWords={focusWords}
          onSaveFocus={handleSaveFocus}
          onClose={() => setShowPortal(false)}
        />
      )}
    </div>
  );
}
