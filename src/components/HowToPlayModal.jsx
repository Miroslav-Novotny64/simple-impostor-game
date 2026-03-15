import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * HowToPlayModal Component
 * Renders an overlay with game instructions.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 */
const HowToPlayModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
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
                <p><strong>Imposter</strong> nezná slovo, ale dostane nápovědu.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">4</div>
                <p>Jděte dokola a každý vždy řekněte slovo nebo slovní spojení týkající se tématu.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">5</div>
                <p>Až budete chtít, hlasujte pro impostora. Pokud odhalíte impostora, vyhráváte. Pokud ne, imposter vyhrává.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              ROZUMÍM
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HowToPlayModal;
