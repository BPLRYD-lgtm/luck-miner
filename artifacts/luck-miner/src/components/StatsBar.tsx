import { cn } from "@/lib/utils";
import { Coins, Diamond, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBarProps {
  coins: number;
  relics: number;
  onMenuClick: () => void;
}

export function StatsBar({ coins, relics, onMenuClick }: StatsBarProps) {
  return (
    <div className="flex items-center justify-between w-full p-4 z-10">
      <div className="flex gap-3">
        {/* Coins Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card flex items-center gap-2 px-4 py-2 rounded-full border-neon-gold/50 border bg-black/40"
        >
          <div className="bg-neon-gold/20 p-1 rounded-full">
            <Coins className="w-4 h-4 text-neon-gold" />
          </div>
          <span className="font-display font-bold text-white tracking-wide">
            {coins.toLocaleString()}
          </span>
        </motion.div>

        {/* Relics Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card flex items-center gap-2 px-4 py-2 rounded-full border-neon-cyan/50 border bg-black/40"
        >
          <div className="bg-neon-cyan/20 p-1 rounded-full">
            <Diamond className="w-4 h-4 text-neon-cyan" />
          </div>
          <span className="font-display font-bold text-white tracking-wide">
            {relics.toLocaleString()}
          </span>
        </motion.div>
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuClick}
        className="glass-card p-3 rounded-full hover:bg-white/10 transition-colors"
      >
        <Settings className="w-5 h-5 text-white/80" />
      </motion.button>
    </div>
  );
}
