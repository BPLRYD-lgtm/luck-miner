import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface CashoutToastProps {
  show: boolean;
  amount: number;
}

export function CashoutToast({ show, amount }: CashoutToastProps) {
  useEffect(() => {
    if (show) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#00F5FF', '#FF00FF', '#FFD700']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#00F5FF', '#FF00FF', '#FFD700']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold text-neon-gold neon-text-gold tracking-tighter drop-shadow-2xl">
              +{amount}
            </span>
            <span className="text-white font-bold tracking-widest mt-2 uppercase bg-black/50 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
              Coins Added
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
