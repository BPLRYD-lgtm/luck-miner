import { TileData } from "@/hooks/use-game-state";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TileProps {
  data: TileData;
  onClick: () => void;
  disabled: boolean;
}

export function Tile({ data, onClick, disabled }: TileProps) {
  
  const getTileContent = () => {
    if (!data.revealed) return null;
    
    switch (data.type) {
      case 'coin':
        return (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-2xl drop-shadow-lg mb-1">🪙</span>
            <span className="font-display font-bold text-xs text-neon-gold neon-text-gold">+{data.value}</span>
          </motion.div>
        );
      case 'relic':
        return (
          <motion.div 
            initial={{ scale: 0.5, rotate: -45, opacity: 0 }} 
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-2xl drop-shadow-lg mb-1">💎</span>
            <span className="font-display font-bold text-xs text-neon-cyan neon-text-cyan">+{data.value}</span>
          </motion.div>
        );
      case 'multiplier':
        return (
          <motion.div 
            initial={{ scale: 0.5, y: 10, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-2xl drop-shadow-lg mb-1">✨</span>
            <span className="font-display font-bold text-xs text-neon-fuchsia">+{(data.value).toFixed(1)}x</span>
          </motion.div>
        );
      case 'trap':
        return (
          <motion.div 
            initial={{ scale: 1.5, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center relative"
          >
            <span className="text-3xl drop-shadow-lg z-10">💥</span>
            {data.isShieldedTrap && (
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 2], opacity: [1, 1, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full border-4 border-blue-400 bg-blue-400/20"
              />
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.button
      whileHover={!data.revealed && !disabled ? { scale: 1.05 } : {}}
      whileTap={!data.revealed && !disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || data.revealed}
      className={cn(
        "relative w-full aspect-square rounded-2xl flex items-center justify-center transition-colors duration-300",
        data.revealed 
          ? (data.type === 'trap' && !data.isShieldedTrap 
              ? 'bg-rose-950/80 border-2 border-rose-500/50 shadow-[inset_0_0_20px_rgba(225,29,72,0.3)]'
              : data.isShieldedTrap
                ? 'bg-blue-950/80 border-2 border-blue-500/50 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-white/10 border border-white/20 shadow-inner')
          : 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-t border-l border-white/10 shadow-lg shadow-black/50 cursor-pointer hover:from-indigo-800 hover:to-purple-800'
      )}
      style={{
        transformStyle: "preserve-3d"
      }}
    >
      {/* Hidden state texture */}
      {!data.revealed && (
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
      )}
      
      {getTileContent()}
      
    </motion.button>
  );
}
