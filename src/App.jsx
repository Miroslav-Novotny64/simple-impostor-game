import { useState, useRef, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import { Plus, X, Play, ArrowRight, RefreshCw, Eye, Users, Check, AlertCircle, Edit2, Sun, Moon } from 'lucide-react';
import { cn } from './lib/utils';
import { CATEGORIES } from './data/categories';
import './App.css';


function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, pass_phone, reveal, discussion
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
    return ['Zvířata'];
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
    
    // Push history state
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
        return prev + 12; // Snappy hold speed
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
        // Fallback to lobby if no state
        setGameState('lobby');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
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

        <AnimatePresence>
          {showHowToPlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background border-2 border-primary rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 overflow-hidden relative"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                
                <h2 className="text-3xl font-black text-primary italic tracking-tighter">JAK HRÁT?</h2>
                
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">1</div>
                    <p>Přidej hráče a vyber kategorie slov.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">2</div>
                    <p>Každý si tajně prohlédne svou kartu. Všichni kromě jednoho uvidí stejné slovo.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">3</div>
                    <p><strong>Vetřelec (Impostor)</strong> nezná slovo, ale dostane nápovědu.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">4</div>
                    <p>Diskutujte a snažte se odhalit, kdo je vetřelec!</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  ROZUMÍM
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {gameState === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8 py-8"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.h1 
                  className="text-6xl font-black tracking-tighter text-primary italic drop-shadow-[0_4px_12px_rgba(255,195,0,0.4)]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  IMPOSTOR
                </motion.h1>
                <p className="text-muted-foreground font-semibold uppercase tracking-[0.2em] text-[10px]">Najdi impostora mezi námi</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Users size={20} className="text-primary" /> Hráči ({players.length}/12)
                  </h2>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Jméno hráče..."
                      className="flex-1 bg-secondary/50 border-border border-2 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                      onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    />
                    <button 
                      onClick={addPlayer}
                      className="bg-primary text-primary-foreground p-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <div className="max-h-[35vh] overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                      {players.map((player, idx) => (
                        <motion.div 
                          key={player.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex justify-between items-center bg-secondary/50 backdrop-blur-sm p-3 rounded-xl border border-primary/10 group hover:border-primary/50 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {idx + 1}
                            </div>
                            {editingPlayerId === player.id ? (
                              <input
                                autoFocus
                                className="bg-background/50 border-none outline-none font-semibold w-full rounded px-1"
                                value={player.name}
                                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                                onBlur={() => setEditingPlayerId(null)}
                                onKeyPress={(e) => e.key === 'Enter' && setEditingPlayerId(null)}
                              />
                            ) : (
                              <span 
                                className="font-semibold cursor-pointer flex-1"
                                onClick={() => setEditingPlayerId(player.id)}
                              >
                                {player.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setEditingPlayerId(player.id)}
                              className="text-muted-foreground hover:text-primary p-1 md:opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => removePlayer(player.id)} 
                              className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold px-2">Kategorie</h2>
                <div className="flex flex-wrap gap-2 px-1">
                  {Object.keys(CATEGORIES).map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "px-5 py-2.5 rounded-2xl font-bold text-sm transition-all border-2",
                        selectedCategories.includes(cat) 
                          ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30 scale-105" 
                          : "bg-secondary/30 border-primary/10 text-muted-foreground hover:bg-secondary/60"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={players.length < 3}
                className="mt-4 bg-primary text-primary-foreground py-5 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100"
              >
                <Play fill="currentColor" size={28} /> HRÁT!
              </button>
            </motion.div>
          )}

          {gameState === 'reveal' && (
            <motion.div
              key={`reveal-${currentPlayerReveal}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center min-h-[85vh] gap-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                  <p className="text-primary-foreground font-black uppercase tracking-widest text-[10px]">Předat hráči</p>
                </div>
                <h2 className="text-6xl font-black text-foreground drop-shadow-md italic tracking-tighter">
                  {players[currentPlayerReveal].name}
                </h2>
              </div>

              {/* Card Container */}
              <div className="perspective-1000 w-full max-w-[320px] aspect-[4/5] min-h-[400px] relative">
                <motion.div
                  className="w-full h-full preserve-3d"
                  animate={{ rotateY: holdProgress === 100 ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  {/* Front Side */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center border-4 transition-all duration-300 overflow-hidden backface-hidden rounded-[2.5rem]",
                      holdProgress > 0 ? "border-primary scale-[0.98]" : "border-muted"
                    )}
                  >
                    <motion.div 
                      className="absolute bottom-0 left-0 h-2 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${holdProgress}%` }}
                    />

                    <div className="flex flex-col items-center gap-6 px-8 text-center">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center" style={{ transform: `scale(${1 + holdProgress/200})` }}>
                        <Eye size={48} className="text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-foreground italic uppercase tracking-tight">Podrž kartu</p>
                        <p className="text-sm text-muted-foreground font-medium italic">Nikdo další se nesmí dívat!</p>
                      </div>
                    </div>
                  </div>

                  {/* Back Side (Revealed) */}
                  <div
                    className="absolute inset-0 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center border-4 border-primary overflow-hidden backface-hidden rounded-[2.5rem]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex flex-col items-center gap-6 p-8 text-center">
                      {currentPlayerReveal === impostorIndex ? (
                        <>
                          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                            <AlertCircle size={40} className="text-destructive" />
                          </div>
                          <h3 className="text-4xl font-black text-destructive tracking-tighter italic">IMPOSTOR!</h3>
                          <div className="bg-destructive/5 p-4 rounded-2xl border border-destructive/20 w-full">
                            <p className="text-xs text-destructive font-black uppercase mb-1">Nápověda pro tebe</p>
                            <p className="font-bold text-lg leading-tight">{secretWord.hint}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Check size={40} className="text-primary" />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-1">Tvoje slovo</p>
                              <h3 className="text-5xl font-black text-primary italic break-words leading-tight tracking-tighter">{secretWord.word}</h3>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Interaction Overlay - Captures touch even when card is flipped */}
                <div 
                  className="absolute inset-0 z-10 cursor-pointer touch-none"
                  onPointerDown={handleHoldStart}
                  onPointerUp={handleHoldEnd}
                  onPointerLeave={handleHoldEnd}
                />
              </div>

              <div className="h-16">
                <AnimatePresence>
                  {hasRevealed && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={nextReveal}
                      className="group bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-black text-xl shadow-lg shadow-primary/30 flex items-center gap-3 transition-all active:scale-95"
                    >
                      {currentPlayerReveal < players.length - 1 ? 'DALŠÍ HRÁČ' : 'KONEC ODHALOVÁNÍ'} 
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {gameState === 'discussion' && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[85vh] text-center"
            >
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-primary/20 rounded-[4rem] blur-3xl -z-10" />
                <div className="bg-background/90 backdrop-blur-2xl p-10 rounded-[3rem] border-2 border-primary shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-primary italic leading-tight uppercase tracking-tighter">Diskuse</h2>
                    <p className="text-lg font-semibold text-muted-foreground leading-relaxed">
                      Všichni znají své úkoly.<br/>
                      Teď najděte impostora!
                    </p>
                  </div>
                  
                  <div className="grid gap-4 py-4">
                    <div className="flex items-start gap-4 text-left bg-background/50 p-4 rounded-2xl border border-border">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary mt-1">
                        <AlertCircle size={20} />
                      </div>
                      <p className="text-sm font-medium">Ptají se všichni. Vetřelec maskuje, že nezná slovo, a snaží se ho uhodnout z vašich popisů!</p>
                    </div>
                  </div>

                  <button
                    onClick={resetGame}
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <RefreshCw size={24} /> NOVÁ HRA
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto py-8 border-t border-primary/10 flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <a href="https://github.com/miraneek" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6 fill-current">
                <use href="/icons.svg#github-icon" />
              </svg>
            </a>
            <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6 fill-current">
                <use href="/icons.svg#bluesky-icon" />
              </svg>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6 fill-current">
                <use href="/icons.svg#discord-icon" />
              </svg>
            </a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 italic">
            &copy; {new Date().getFullYear()} Impostor Game
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
