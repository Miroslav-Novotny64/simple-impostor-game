import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Play, Users, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Lobby Component
 * Renders the initial screen where players are managed and categories are selected.
 * 
 * @param {Object} props
 * @param {Array} props.players - List of players
 * @param {string} props.newPlayerName - Current input for new player name
 * @param {Function} props.setNewPlayerName - Setter for new player name
 * @param {Function} props.addPlayer - Handler to add a player
 * @param {Function} props.removePlayer - Handler to remove a player
 * @param {number|null} props.editingPlayerId - ID of player currently being edited
 * @param {Function} props.setEditingPlayerId - Setter for editing player ID
 * @param {Function} props.updatePlayerName - Handler to update player name
 * @param {Object} props.CATEGORIES - Available word categories
 * @param {Array} props.selectedCategories - Currently selected categories
 * @param {Function} props.toggleCategory - Handler to toggle a category
 * @param {Function} props.startGame - Handler to start the game
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
  selectedCategories,
  toggleCategory,
  startGame
}) => {
  return (
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
        <p className="text-muted-foreground font-semibold uppercase tracking-[0.2em] text-[10px]">Najdi impostera</p>
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
  );
};

export default Lobby;
