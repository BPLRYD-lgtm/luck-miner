import { Shield, Flame, Activity, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StatusBadgesProps {
  shields: number;
  runRisk: number;
  streakHeat: number;
  bestScore: number;
}

export function StatusBadges({ shields, runRisk, streakHeat, bestScore }: StatusBadgesProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full px-4 mb-6">
      <Badge icon={<Shield className="w-3 h-3 text-blue-400" />} label="Shields" value={shields} />
      <Badge icon={<Activity className="w-3 h-3 text-rose-400" />} label="Risk" value={`${(runRisk * 100).toFixed(1)}%`} />
      <Badge icon={<Flame className="w-3 h-3 text-orange-400" />} label="Heat" value={`${(streakHeat * 100).toFixed(0)}%`} />
      <Badge icon={<Trophy className="w-3 h-3 text-yellow-400" />} label="Best" value={bestScore} />
    </div>
  );
}

function Badge({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex flex-col items-center justify-center p-2 rounded-xl bg-black/30"
    >
      <div className="flex items-center gap-1 mb-1 opacity-70">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
      </div>
      <span className="font-display font-bold text-sm text-white">{value}</span>
    </motion.div>
  );
}
