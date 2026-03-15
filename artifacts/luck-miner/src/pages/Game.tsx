import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { useFreePlays } from "@/hooks/use-free-plays";
import { StatsBar } from "@/components/StatsBar";
import { GameBoard } from "@/components/GameBoard";
import { HaulDisplay } from "@/components/HaulDisplay";
import { StatusBadges } from "@/components/StatusBadges";
import { BottomDrawer } from "@/components/BottomDrawer";
import { CashoutToast } from "@/components/CashoutToast";

export default function Game() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastAmount, setToastAmount] = useState(0);

  const {
    freePlays,
    hasFreePlays,
    consumeFreePlay,
    timeUntilReset
  } = useFreePlays();

  const {
    status, board, haul, runMultiplier, runRisk, streakHeat,
    globalCoins, globalRelics, globalShields, bestScore,
    startRun, digTile, cashOut, buyShield, canAffordPlay
  } = useGameState(consumeFreePlay, hasFreePlays);

  const handleCashOut = () => {
    const finalAmount = Math.floor(haul * runMultiplier);
    setToastAmount(finalAmount);
    setShowToast(true);
    cashOut();
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background overflow-hidden relative selection:bg-neon-fuchsia/30 selection:text-white pb-safe">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-0 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] right-0 w-64 h-64 bg-neon-fuchsia/20 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md flex flex-col flex-1 relative z-10">
        <StatsBar 
          coins={globalCoins} 
          relics={globalRelics} 
          onMenuClick={() => setDrawerOpen(true)} 
        />

        <div className="flex-1 flex flex-col justify-center items-center py-4 w-full">
          <GameBoard 
            board={board} 
            status={status} 
            onTileClick={digTile}
            onActionClick={startRun}
          />
          
          <StatusBadges 
            shields={globalShields}
            runRisk={runRisk}
            streakHeat={streakHeat}
            bestScore={bestScore}
          />
        </div>

        <div className="pb-8 pt-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <HaulDisplay 
            status={status}
            haul={haul}
            multiplier={runMultiplier}
            freePlays={freePlays}
            hasFreePlays={hasFreePlays}
            canAffordPlay={canAffordPlay}
            timeUntilReset={timeUntilReset}
            onCashOut={handleCashOut}
            onPlayAgain={startRun}
          />
        </div>
      </div>

      <BottomDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        coins={globalCoins}
        onBuyShield={buyShield}
      />

      <CashoutToast show={showToast} amount={toastAmount} />
    </div>
  );
}
