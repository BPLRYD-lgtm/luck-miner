import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Info, Gift, Heart } from "lucide-react";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onBuyShield: () => void;
}

export function BottomDrawer({ isOpen, onClose, coins, onBuyShield }: BottomDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[70vh] bg-zinc-950 border-t border-white/10 z-50 rounded-t-3xl overflow-hidden flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" onClick={onClose}>
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="flex justify-between items-center px-6 pb-4 border-b border-white/5">
              <h2 className="font-display font-bold text-xl text-white">Headquarters</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              
              {/* Shield Store */}
              <div className="glass-card rounded-2xl p-5 border-neon-cyan/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">Buy Protection</h3>
                    <p className="text-sm text-white/60 mb-4 leading-relaxed">
                      Absorbs one trap hit per run. Essential for deep digs.
                    </p>
                    <button 
                      onClick={onBuyShield}
                      disabled={coins < 80}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        coins >= 80 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      Buy Shield (80 Coins)
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Modules */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-white/5 opacity-70">
                  <Gift className="w-6 h-6 text-neon-fuchsia" />
                  <span className="font-bold text-sm text-white">Daily Gift</span>
                  <span className="text-xs text-white/50">Coming Soon</span>
                </div>
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-white/5 opacity-70">
                  <Heart className="w-6 h-6 text-neon-gold" />
                  <span className="font-bold text-sm text-white">Support</span>
                  <span className="text-xs text-white/50">Follow on X</span>
                </div>
              </div>

              {/* Rules summary */}
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-2 text-white/50 mb-2">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">How to Play</span>
                </div>
                <ul className="text-sm text-white/50 space-y-2 pl-6 list-disc">
                  <li>Every safe dig increases your risk slightly.</li>
                  <li>Cashing out increases the base heat for next run.</li>
                  <li>Hitting a trap drops the heat significantly.</li>
                  <li>Multipliers apply to your final cashout haul.</li>
                </ul>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
