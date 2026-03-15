import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Plus, X, Play, Users, Edit2, Trash2, 
  ChevronDown, ChevronUp, Share2, Download, 
  Github, Check, Info, Copy
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Lobby Component
 * Renders the initial screen where players are managed and categories are selected.
 */
const Lobby = ({
  players,
  newPlayerName,
  setNewPlayerName,
  addPlayer,
  removePlayer,
  editingPlayerId,
  setEditingPlayerId,
  updatePlayerName,
  CATEGORIES,
  customCategories,
  addCategory,
  removeCategory,
  importCategory,
  addWordToCategory,
  removeWordFromCategory,
  selectedCategories,
  toggleCategory,
  startGame
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [newWord, setNewWord] = useState('');
  const [newHint, setNewHint] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showShareInfo, setShowShareInfo] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);

  const [categoriesCollapsed, setCategoriesCollapsed] = useState(false);
  const [playersCollapsed, setPlayersCollapsed] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setCategoriesCollapsed(false);
    }
  };

  const handleAddWord = (catName) => {
    if (newWord.trim() && newHint.trim()) {
      addWordToCategory(catName, { word: newWord.trim(), hint: newHint.trim() });
      setNewWord('');
      setNewHint('');
    }
  };

  const handleExport = (catName) => {
    const data = {
      name: catName,
      words: CATEGORIES[catName]
    };
    const json = JSON.stringify(data);
    navigator.clipboard.writeText(json);
    setCopySuccess(catName);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleImport = () => {
    if (importCategory(importJson)) {
      setImportJson('');
      setIsImporting(false);
      setCategoriesCollapsed(false);
    }
  };

  return (
    <motion.div
      key="lobby"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8 py-8"
    >
      <div className="flex flex-col mt-6 items-center gap-2">
        <motion.h1 
          className="text-6xl font-black tracking-tighter text-primary italic drop-shadow-[0_2px_8px_rgba(255,195,0,0.3)]"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          IMPOSTOR
        </motion.h1>
        <p className="text-muted-foreground font-semibold uppercase tracking-[0.2em] text-[10px]">Najdi impostera</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => setPlayersCollapsed(!playersCollapsed)}
            className="flex items-center gap-2 group"
          >
            <h2 className="text-lg font-bold opacity-80 group-hover:text-primary transition-colors flex items-center gap-2">
              <Users size={18} className="text-primary" /> Hráči ({players.length}/12)
            </h2>
            <div className={cn("transition-transform duration-300", playersCollapsed ? "-rotate-90 text-muted-foreground" : "text-primary")}>
              <ChevronDown size={20} />
            </div>
          </button>
        </div>
        
        <AnimatePresence>
          {!playersCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid gap-2 pt-1 pb-4 px-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Jméno hráče..."
                    className="flex-1 bg-secondary/30 border-primary/10 border-2 rounded-2xl px-4 py-3 outline-none focus:border-primary/50 transition-all font-medium text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  />
                  <button 
                    onClick={addPlayer}
                    className="bg-primary text-primary-foreground p-3 rounded-2xl hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/10"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {players.map((player, idx) => (
                      <motion.div 
                        key={player.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex justify-between items-center bg-secondary/20 backdrop-blur-sm p-3 rounded-2xl border border-primary/5 group hover:border-primary/20 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs shrink-0">
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
                              className="font-semibold cursor-pointer flex-1 text-sm"
                              onClick={() => setEditingPlayerId(player.id)}
                            >
                              {player.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setEditingPlayerId(player.id)}
                            className="text-muted-foreground hover:text-primary p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => removePlayer(player.id)} 
                            className="text-muted-foreground hover:text-destructive p-1.5 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => setCategoriesCollapsed(!categoriesCollapsed)}
            className="flex items-center gap-2 group"
          >
            <h2 className="text-lg font-bold opacity-80 group-hover:text-primary transition-colors">Kategorie</h2>
            <div className={cn("transition-transform duration-300", categoriesCollapsed ? "-rotate-90 text-muted-foreground" : "text-primary")}>
              <ChevronDown size={20} />
            </div>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsImporting(!isImporting)}
              className={cn(
                "p-2 rounded-xl border border-primary/10 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
                isImporting ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <Download size={14} /> Import
            </button>
            <button 
              onClick={() => setShowShareInfo(!showShareInfo)}
              className={cn(
                "p-2 rounded-xl border border-primary/10 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
                showShareInfo ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <Share2 size={14} /> Sdílet
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!categoriesCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
        
        <AnimatePresence>
          {isImporting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-2 overflow-hidden"
            >
              <div className="bg-secondary/20 p-4 rounded-2xl border-2 border-primary/20 space-y-3">
                <p className="text-xs font-bold text-muted-foreground">Vložit JSON kategorie:</p>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='{"name": "...", "words": [...]}'
                  className="w-full bg-background/50 border border-primary/10 rounded-xl p-3 text-[10px] font-mono h-24 outline-none focus:border-primary/30"
                />
                <button
                  onClick={handleImport}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-bold text-sm"
                >
                  IMPORTOVAT
                </button>
              </div>
            </motion.div>
          )}

          {showShareInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-2 overflow-hidden"
            >
              <div className="bg-primary/5 p-4 rounded-2xl border-2 border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Info size={16} />
                  <p className="text-xs font-bold uppercase tracking-wider">Jak sdílet?</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Každou svou kategorii můžeš exportovat jako text a poslat kamarádovi. Stačí u ní kliknout na <Share2 size={12} className="inline-block mx-1" />.
                </p>
                <div className="pt-2 border-t border-primary/10">
                  <p className="text-[10px] font-black uppercase text-primary mb-2">Chceš kategorii přidat pro všechny?</p>
                  <a 
                    href="https://github.com/Miroslav-Novotny64/simple-impostor-game/issues/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-background border border-primary/20 px-3 py-2 rounded-xl text-xs font-bold hover:bg-secondary/50 transition-colors"
                  >
                    <Github size={14} /> Přidat žádost na GitHub
                  </a>
                  <p className="text-[9px] text-muted-foreground mt-2 italic">
                    Stačí otevřít "Issue" a vložit tam exportovaný JSON.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 px-2 pb-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nová kategorie..."
            className="flex-1 bg-secondary/30 border-primary/10 border-2 rounded-2xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button 
            onClick={handleAddCategory}
            className="bg-primary/10 text-primary p-3 rounded-2xl hover:bg-primary/20 transition-all"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-1">
          {Object.keys(CATEGORIES).map(cat => {
            const isCustom = !!customCategories[cat];
            const isSelected = selectedCategories.includes(cat);
            const isExpanded = expandedCategory === cat;
            
            return (
              <div 
                key={cat}
                className={cn(
                  "flex flex-col rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                  isSelected ? "border-primary/40 bg-primary/5" : "border-primary/5 bg-secondary/5"
                )}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0",
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-primary/10 bg-background/50"
                      )}
                    >
                      {isSelected && <Check size={16} strokeWidth={4} />}
                    </button>
                    <button 
                      onClick={() => toggleCategory(cat)}
                      className="font-bold text-sm truncate flex-1 text-left opacity-90"
                    >
                      {cat} <span className="text-[10px] text-muted-foreground font-medium ml-1">({CATEGORIES[cat].length})</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExport(cat)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        copySuccess === cat ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary/50"
                      )}
                      title="Exportovat (Kopírovat JSON)"
                    >
                      {copySuccess === cat ? <Copy size={16} /> : <Share2 size={16} />}
                    </button>
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(cat);
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Smazat kategorii"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-background/30 border-t border-primary/5"
                    >
                      <div className="p-4 space-y-4">
                        {isCustom && (
                          <div className="space-y-2 bg-secondary/10 p-3 rounded-xl border border-primary/5">
                            <p className="text-[9px] uppercase font-black text-primary tracking-widest px-1">Přidat slovo</p>
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                placeholder="Slovo"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                                className="bg-background/80 border border-primary/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/30"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Nápověda"
                                  value={newHint}
                                  onChange={(e) => setNewHint(e.target.value)}
                                  className="flex-1 bg-background/80 border border-primary/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/30"
                                />
                                <button
                                  onClick={() => handleAddWord(cat)}
                                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-xs"
                                >
                                  PŘIDAT
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest px-1">Slova v kategorii</p>
                          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                            {CATEGORIES[cat].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-secondary/10 p-2 rounded-xl group border border-transparent hover:border-primary/10 transition-all">
                                <div className="overflow-hidden px-1">
                                  <p className="text-sm font-bold truncate opacity-90">{item.word}</p>
                                  <p className="text-[10px] text-muted-foreground truncate italic opacity-80">{item.hint}</p>
                                </div>
                                {isCustom && (
                                  <button
                                    onClick={() => removeWordFromCategory(cat, idx)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {CATEGORIES[cat].length === 0 && (
                              <p className="text-[10px] text-muted-foreground italic p-2 text-center">Kategorie neobsahuje žádná slova.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

      <button
        onClick={startGame}
        disabled={players.length < 3 || selectedCategories.length === 0}
        className="mt-4 bg-primary text-primary-foreground py-5 rounded-4xl font-black text-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:scale-100"
      >
        <Play fill="currentColor" size={28} /> HRÁT!
      </button>
    </motion.div>
  );
};

export default Lobby;
