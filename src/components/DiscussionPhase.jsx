import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

/**
 * DiscussionPhase Component
 * Renders the final screen where players discuss and try to find the impostor.
 * 
 * @param {Object} props
 * @param {Function} props.resetGame - Handler to reset the game and go back to lobby
 */
const DiscussionPhase = ({ resetGame }) => {
  return (
    <motion.div
      key="discussion"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[85vh] text-center"
    >
      <div className="relative w-full max-sm:max-w-sm">
        <div className="absolute inset-0 bg-primary/20 rounded-[4rem] blur-3xl -z-10" />
        <div className="bg-background/90 backdrop-blur-2xl p-10 rounded-[3rem] border-2 border-primary shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-primary italic leading-tight uppercase tracking-tighter">Diskuse</h2>
            <p className="text-lg font-semibold text-muted-foreground leading-relaxed">
              Všichni znají své slovo.<br/>
              Teď najděte impostera!
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={resetGame}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <RefreshCw size={24} /> NOVÁ HRA
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscussionPhase;
