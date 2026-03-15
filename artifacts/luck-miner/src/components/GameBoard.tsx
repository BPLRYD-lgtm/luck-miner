import { TileData, GameStatus } from "@/hooks/use-game-state";
import { Tile } from "./Tile";
import { motion, AnimatePresence } from "framer-motion";

interface GameBoardProps {
  board: TileData[];
  status: GameStatus;
  onTileClick: (index: number) => void;
  onActionClick: () => void;
}

export function GameBoard({ board, status, onTileClick, onActionClick }: GameBoardProps) {
  
  return (
    <div className="relative w-full max-w-[360px] mx-auto mb-8">
      {/* The Grid Container */}
      <div className="glass-panel p-3 rounded-3xl relative overflow-hidden">
        {/* Glow Effects behind board */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-neon-cyan/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-neon-fuchsia/20 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-4 gap-2 relative z-10">
          {board.length > 0
            ? board.map((tile, i) => (
                <Tile 
                  key={tile.id} 
                  data={tile} 
                  onClick={() => onTileClick(i)} 
                  disabled={status !== 'playing'}
                />
              ))
            : Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-full aspect-square rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-t border-l border-white/10"
                />
              ))
          }
        </div>
      </div>

      {/* Status Overlays */}
      <AnimatePresence>
        {status !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 rounded-3xl p-6 text-center"
          >
            {status === 'idle' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Ready to Dig?</h2>
                <p className="text-white/70 mb-6">Avoid traps, collect loot.</p>
                <button 
                  onClick={onActionClick}
                  className="bg-neon-cyan text-black px-8 py-3 rounded-full font-bold font-display shadow-[0_0_20px_hsla(188,100%,50%,0.5)] active:scale-95 transition-transform"
                >
                  START RUN
                </button>
              </motion.div>
            )}

            {status === 'won' && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <h2 className="text-3xl font-display font-bold text-neon-gold neon-text-gold mb-2">Cashed Out!</h2>
                <p className="text-white/90 mb-6">Safe and sound with your loot.</p>
              </motion.div>
            )}

            {status === 'lost' && (
              <motion.div initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }}>
                <span className="text-6xl mb-4 block">💥</span>
                <h2 className="text-3xl font-display font-bold text-rose-500 neon-border-rose mb-2">Busted!</h2>
                <p className="text-white/70">You hit an unshielded trap.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
