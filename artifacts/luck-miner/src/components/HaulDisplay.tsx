import { motion, AnimatePresence } from "framer-motion";
import { Coins, Play, RotateCcw } from "lucide-react";

interface HaulDisplayProps {
  status: 'idle' | 'playing' | 'won' | 'lost';
  haul: number;
  multiplier: number;
  freePlays: number;
  hasFreePlays: boolean;
  canAffordPlay: boolean;
  timeUntilReset: string;
  onCashOut: () => void;
  onPlayAgain: () => void;
}

export function HaulDisplay({ 
  status, haul, multiplier, freePlays, hasFreePlays, canAffordPlay, timeUntilReset, onCashOut, onPlayAgain 
}: HaulDisplayProps) {
  
  const currentTotal = Math.floor(haul * multiplier);
  
  return (
    <div className="flex flex-col items-center w-full px-6 gap-4 z-10">
      
      {/* Current Haul Pill */}
      <AnimatePresence mode="wait">
        {status === 'playing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-card px-6 py-3 rounded-full flex items-center gap-3 border-neon-cyan/30"
          >
            <span className="text-xl">⛏️</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-neon-cyan font-bold uppercase tracking-wider">Current Haul</span>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white">{currentTotal}</span>
                {multiplier > 1 && (
                  <span className="text-sm font-display text-neon-fuchsia">×{multiplier.toFixed(1)}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex w-full gap-3">
        {(status === 'playing') ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCashOut}
            disabled={haul === 0}
            className={`flex-1 py-4 rounded-2xl font-display font-bold text-lg shadow-xl transition-all relative overflow-hidden group
              ${haul > 0 
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black neon-border-gold' 
                : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
          >
            {haul > 0 && (
              <motion.div 
                className="absolute inset-0 bg-white/20"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Coins className="w-5 h-5" />
              CASH OUT
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={canAffordPlay ? { scale: 0.95 } : {}}
            onClick={onPlayAgain}
            disabled={!canAffordPlay}
            className={`flex-1 py-4 rounded-2xl font-display font-bold text-lg shadow-xl transition-all relative overflow-hidden
              ${canAffordPlay 
                ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white neon-border-cyan' 
                : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'}`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {status === 'idle' ? <Play className="w-5 h-5 fill-current" /> : <RotateCcw className="w-5 h-5" />}
              {status === 'idle' ? 'START DIG' : 'PLAY AGAIN'}
            </span>
          </motion.button>
        )}
      </div>

      {/* Free Plays Strip */}
      <div className="glass-card px-4 py-2 rounded-full text-xs font-medium text-white/70 text-center w-full max-w-sm">
        <div className="flex items-center justify-between">
          <span>Free Plays: <strong className="text-white">{freePlays}/8</strong></span>
          <span className="w-1 h-1 rounded-full bg-white/30 mx-2" />
          <span>Cost: {hasFreePlays ? 'Free' : '40 Coins'}</span>
          <span className="w-1 h-1 rounded-full bg-white/30 mx-2" />
          <span className="text-neon-cyan opacity-80">Reset in {timeUntilReset}</span>
        </div>
      </div>
    </div>
  );
}
