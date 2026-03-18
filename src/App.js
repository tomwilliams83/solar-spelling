import React, { useState, useEffect, useCallback } from 'react';
import { PLANETS, AVATARS } from './data/levels.js';
import StarField from './components/StarField.js';
import WelcomeScreen from './components/WelcomeScreen.js';
import SolarMap from './components/SolarMap.js';
import GameScreen from './components/GameScreen.js';
import FactsScreen from './components/FactsScreen.js';
import TravelScreen from './components/TravelScreen.js';

const STORAGE_KEY = 'solar-spelling-save';

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function writeSave(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function App() {
  const [screen, setScreen] = useState('welcome'); // welcome | map | game | facts | travel
  const [playerName, setPlayerName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [completedLevels, setCompletedLevels] = useState({}); // { planetId: { score, stars } }
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [travelFrom, setTravelFrom] = useState(null);
  const [travelTo, setTravelTo] = useState(null);
  const [gameScore, setGameScore] = useState(null);

  // Load save on mount
  useEffect(() => {
    const save = loadSave();
    if (save) {
      setPlayerName(save.playerName || '');
      setAvatar(AVATARS.find(a => a.id === save.avatarId) || AVATARS[0]);
      setCompletedLevels(save.completedLevels || {});
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
    const updated = {
      ...prev.completedLevels,
      [planetId]: { score, stars },
    };
    setCompletedLevels(updated);
    writeSave({ ...prev, completedLevels: updated });
    setGameScore({ score, stars });
    setScreen('facts');
  }, []);

  const handleFactsDone = useCallback(() => {
    const idx = PLANETS.findIndex(p => p.id === currentPlanet.id);
    const next = PLANETS[idx + 1];
    if (next) {
      setTravelFrom(currentPlanet);
      setTravelTo(next);
      setScreen('travel');
    } else {
      setScreen('map');
    }
  }, [currentPlanet]);

  const handleTravelDone = useCallback(() => {
    setCurrentPlanet(null);
    setScreen('map');
  }, []);

  const handleBackToMap = useCallback(() => {
    setCurrentPlanet(null);
    setScreen('map');
  }, []);

  const highestUnlocked = PLANETS.findIndex(p => !completedLevels[p.id]);
  const unlockedIndex = highestUnlocked === -1 ? PLANETS.length - 1 : highestUnlocked;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--space-dark)' }}>
      <StarField />

      {screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} existingSave={loadSave()} />
      )}

      {screen === 'map' && (
        <SolarMap
          playerName={playerName}
          avatar={avatar}
          completedLevels={completedLevels}
          unlockedIndex={unlockedIndex}
          onSelectPlanet={handleSelectPlanet}
          onEditProfile={() => setScreen('welcome')}
        />
      )}

      {screen === 'game' && currentPlanet && (
        <GameScreen
          planet={currentPlanet}
          playerName={playerName}
          avatar={avatar}
          onComplete={handleGameComplete}
          onBack={handleBackToMap}
        />
      )}

      {screen === 'facts' && currentPlanet && (
        <FactsScreen
          planet={currentPlanet}
          score={gameScore}
          avatar={avatar}
          playerName={playerName}
          onContinue={handleFactsDone}
        />
      )}

      {screen === 'travel' && (
        <TravelScreen
          from={travelFrom}
          to={travelTo}
          onDone={handleTravelDone}
        />
      )}
    </div>
  );
}
