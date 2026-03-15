import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * RevealPhase Component
 * Renders the screen where players take turns revealing their secret words.
 * 
 * @param {Object} props
 * @param {Array} props.players - List of players
 * @param {number} props.currentPlayerReveal - Index of the player currently revealing
 * @param {number|null} props.impostorIndex - Index of the impostor
 * @param {Object|null} props.secretWord - The secret word and hint
 * @param {number} props.holdProgress - Progress of the card hold (0-100)
 * @param {boolean} props.hasRevealed - Whether the current player has revealed their word
 * @param {Function} props.handleHoldStart - Handler for starting the hold action
 * @param {Function} props.handleHoldEnd - Handler for ending the hold action
 * @param {Function} props.nextReveal - Handler to move to the next player or phase
 */
const RevealPhase = ({
  players,
  currentPlayerReveal,
  impostorIndex,
  secretWord,
  holdProgress,
  hasRevealed,
  handleHoldStart,
  handleHoldEnd,
  nextReveal
}) => {
  return (
    <motion.div
      key={`reveal-${currentPlayerReveal}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center flex-1 gap-6 sm:gap-10 py-2 sm:py-0 w-full"
    >
      <div className="text-center space-y-2 sm:space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/80 border border-primary">
          <p className="text-foreground font-black uppercase tracking-widest text-[8px] sm:text-[10px]">Předat hráči</p>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-foreground drop-shadow-md italic tracking-tighter">
          {players[currentPlayerReveal].name}
        </h2>
      </div>

      <div className="perspective-1000 w-full max-w-[280px] sm:max-w-[320px] aspect-4/5 min-h-[350px] sm:min-h-[400px] relative">
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{ rotateY: holdProgress === 100 ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
        >
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
                      <h3 className="text-5xl font-black text-primary italic wrap-break-word leading-tight tracking-tighter">{secretWord.word}</h3>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

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
  );
};

export default RevealPhase;
