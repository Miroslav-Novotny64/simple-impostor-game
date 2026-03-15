import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Share, PlusSquare, Download, X, MoreVertical } from 'lucide-react';

const PWAInstallModal = ({ isOpen, onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
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
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-secondary/50 text-primary hover:scale-110 active:scale-90 transition-all font-bold z-10"
              aria-label="Zavřít"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Download size={24} />
              </div>
              <h2 className="text-2xl font-black text-primary italic tracking-tighter uppercase">Instalovat aplikaci</h2>
            </div>

            <div className="space-y-6 py-2">
              {isIOS ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium opacity-80">Pro nejlepší zážitek si přidej aplikaci na plochu:</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">1</div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm flex items-center gap-2">
                          Klepni na tlačítko sdílení <Share size={18} className="text-primary" />
                        </p>
                        <p className="text-xs opacity-60">Najdeš ho v dolní liště Safari.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">2</div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm flex items-center gap-2">
                          Zvol "Přidat na plochu" <PlusSquare size={18} className="text-primary" />
                        </p>
                        <p className="text-xs opacity-60">Sjeď v menu trochu níž.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium opacity-80">Pro nejlepší zážitek si nainstaluj PWA aplikaci:</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">1</div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm flex items-center gap-2">
                          Klepni na menu <MoreVertical size={18} className="text-primary" />
                        </p>
                        <p className="text-xs opacity-60">V pravém horním rohu prohlížeče.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">2</div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm flex items-center gap-2">
                          Zvol "Instalovat aplikaci" <Download size={18} className="text-primary" />
                        </p>
                        <p className="text-xs opacity-60">A potvrď instalaci.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

export default PWAInstallModal;
