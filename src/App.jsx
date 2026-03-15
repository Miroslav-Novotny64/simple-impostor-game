import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, Sun, Moon } from 'lucide-react';
import { CATEGORIES } from './data/categories';
import './App.css';

import Lobby from './components/Lobby';
import RevealPhase from './components/RevealPhase';
import DiscussionPhase from './components/DiscussionPhase';
import HowToPlayModal from './components/HowToPlayModal';
import Footer from './components/Footer';

function App() {
  const [gameState, setGameState] = useState('lobby');
  const [players, setPlayers] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('players')) {
      try {
        return JSON.parse(localStorage.getItem('players'));
      } catch (e) {
        console.error('Failed to parse players from localStorage', e);
      }
    }
    return [
      { id: 1, name: 'Hráč 1' },
      { id: 2, name: 'Hráč 2' },
      { id: 3, name: 'Hráč 3' }
    ];
  });
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  
  const [selectedCategories, setSelectedCategories] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('selectedCategories')) {
      try {
        return JSON.parse(localStorage.getItem('selectedCategories'));
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
      }
    }
    return Object.keys(CATEGORIES);
  });
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [secretWord, setSecretWord] = useState(null);
  const [currentPlayerReveal, setCurrentPlayerReveal] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [hasRevealed, setHasRevealed] = useState(false);
  const holdInterval = useRef(null);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 12) {
      const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
      setPlayers([...players, { id: newId, name: newPlayerName.trim() }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    if (players.length > 3) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const updatePlayerName = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) 
        ? (prev.length > 1 ? prev.filter(c => c !== cat) : prev)
        : [...prev, cat]
    );
  };

  const startGame = () => {
    const randomImpostor = Math.floor(Math.random() * players.length);
    const availableWords = selectedCategories.flatMap(cat => CATEGORIES[cat]);
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setImpostorIndex(randomImpostor);
    setSecretWord(randomWord);
    setCurrentPlayerReveal(0);
    setGameState('reveal');
    setHoldProgress(0);
    setHasRevealed(false);
    window.history.pushState({ gameState: 'reveal', currentPlayerReveal: 0 }, '');
  };

  const handleHoldStart = (e) => {
    if (e) e.preventDefault();
    setHoldProgress(0);
    holdInterval.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdInterval.current);
          setHasRevealed(true);
          return 100;
        }
        return prev + 12;
      });
    }, 20);
  };

  const handleHoldEnd = () => {
    setHoldProgress(0);
    clearInterval(holdInterval.current);
  };

  const nextReveal = () => {
    if (currentPlayerReveal < players.length - 1) {
      const nextIndex = currentPlayerReveal + 1;
      setCurrentPlayerReveal(nextIndex);
      setHoldProgress(0);
      setHasRevealed(false);
      window.history.pushState({ gameState: 'reveal', currentPlayerReveal: nextIndex }, '');
    } else {
      setGameState('discussion');
      window.history.pushState({ gameState: 'discussion' }, '');
    }
  };

  const resetGame = () => {
    setGameState('lobby');
    window.history.pushState({ gameState: 'lobby' }, '');
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        const { gameState, currentPlayerReveal } = event.state;
        if (gameState) setGameState(gameState);
        if (currentPlayerReveal !== undefined) setCurrentPlayerReveal(currentPlayerReveal);
        setHoldProgress(0);
        setHasRevealed(false);
      } else {
        setGameState('lobby');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.history.replaceState({ gameState: 'lobby' }, '');

    return () => {
      clearInterval(holdInterval.current);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground p-4 flex flex-col items-center justify-start overflow-x-hidden font-sans transition-colors duration-300">
      <div className="w-full max-w-md flex flex-col h-full gap-6 relative">
        <div className="absolute right-0 top-0 flex gap-2 z-50">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="p-3 rounded-2xl bg-secondary/50 backdrop-blur-md border border-primary/10 text-primary shadow-sm hover:scale-105 active:scale-95 transition-all"
            aria-label="How to play"
          >
            <AlertCircle size={20} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-secondary/50 backdrop-blur-md border border-primary/10 text-primary shadow-sm hover:scale-105 active:scale-95 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <HowToPlayModal 
          isOpen={showHowToPlay} 
          onClose={() => setShowHowToPlay(false)} 
        />

        <AnimatePresence mode="wait">
          {gameState === 'lobby' && (
            <Lobby 
              players={players}
              newPlayerName={newPlayerName}
              setNewPlayerName={setNewPlayerName}
              addPlayer={addPlayer}
              removePlayer={removePlayer}
              editingPlayerId={editingPlayerId}
              setEditingPlayerId={setEditingPlayerId}
              updatePlayerName={updatePlayerName}
              CATEGORIES={CATEGORIES}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              startGame={startGame}
            />
          )}

          {gameState === 'reveal' && (
            <RevealPhase 
              players={players}
              currentPlayerReveal={currentPlayerReveal}
              impostorIndex={impostorIndex}
              secretWord={secretWord}
              holdProgress={holdProgress}
              hasRevealed={hasRevealed}
              handleHoldStart={handleHoldStart}
              handleHoldEnd={handleHoldEnd}
              nextReveal={nextReveal}
            />
          )}

          {gameState === 'discussion' && (
            <DiscussionPhase resetGame={resetGame} />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}

export default App;
