import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Mic2, Users } from 'lucide-react';

/**
 * DiscussionPhase Component
 * Renders the final screen where players discuss and try to find the impostor.
 * 
 * @param {Object} props
 * @param {Function} props.resetGame - Handler to reset the game and go back to lobby
 * @param {Array} props.players - List of players to pick a random one from
 */
const DiscussionPhase = ({ resetGame, players }) => {
  const [startingPlayer, setStartingPlayer] = useState(null);

  useEffect(() => {
    if (players && players.length > 0) {
      const randomPlayer = players[Math.floor(Math.random() * players.length)].name;
      setStartingPlayer(randomPlayer);
    }
  }, []);

  return (
    <motion.div
      key="discussion"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto px-4"
    >
      <div className="relative w-full text-center space-y-12">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-md border border-primary/10 text-primary font-bold text-sm uppercase tracking-widest shadow-sm"
          >
            <Users size={16} />
            Hra skončena
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-6xl font-black text-primary italic leading-tight uppercase tracking-tighter"
          >
            DISKUSE
          </motion.h2>
        </div>

        {startingPlayer ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="relative group lg:scale-110"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[4rem] group-hover:bg-primary/10 transition-colors -z-10" />
            <div className="bg-background/40 backdrop-blur-xl p-10 rounded-[3.5rem] border-2 border-primary/30 shadow-2xl space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="p-5 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                  <Mic2 size={40} />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-black text-primary/60 uppercase tracking-widest">Začíná mluvit:</span>
                  <p className="text-4xl font-black text-primary italic truncate max-w-[280px] drop-shadow-sm leading-tight">
                    {startingPlayer}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Animated Ring */}
            <div className="absolute -inset-2 border-2 border-primary/20 rounded-[4.5rem] animate-pulse-slow -z-20" />
          </motion.div>
        ) : (
          <div className="py-20 text-muted-foreground italic">Načítání hráčů...</div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="pt-8 space-y-6"
        >
          <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed max-w-[280px] mx-auto">
            Všichni znají své slovo.<br/>
            Teď najděte impostera mezi vámi!
          </p>
          
          <button
            onClick={resetGame}
            className="group relative w-full bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground py-5 rounded-4xl font-black text-xl flex items-center justify-center gap-3 border-2 border-primary/20 hover:border-primary shadow-xl hover:shadow-primary/40 active:scale-95 transition-all duration-300"
          >
            <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" /> 
            NOVÁ HRA
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DiscussionPhase;
