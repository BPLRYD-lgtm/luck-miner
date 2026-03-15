import { useState, useEffect, useCallback } from 'react';

// TODO: Replace localStorage with Telegram cloud storage API if running in Telegram
// window.Telegram?.WebApp?.CloudStorage

export type TileType = 'hidden' | 'coin' | 'relic' | 'multiplier' | 'trap';

export interface TileData {
  id: number;
  revealed: boolean;
  type: TileType;
  value: number; 
  isShieldedTrap?: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

// Constants from Spec
const BASE_RISK = 0.045;
const POST_TRAP_RISK = 0.055;
const MAX_RISK = 0.26;
const RISK_STEP = 0.013;
const CASHOUT_PRESSURE_STEP = 0.01;
const CASHOUT_PRESSURE_DROP_ON_TRAP = 0.02;
const MAX_CASHOUT_PRESSURE = 0.08;

const INITIAL_COINS = 220;
const INITIAL_RELICS = 3;
const INITIAL_SHIELDS = 1;
const EXTRA_PLAY_COST = 40;
const SHIELD_COST = 80;

// Storage Keys
const SK_COINS = 'luck_miner_coins';
const SK_RELICS = 'luck_miner_relics';
const SK_SHIELDS = 'luck_miner_shields';
const SK_BEST = 'luck_miner_best_score';
const SK_HEAT = 'luck_miner_streak_heat';

export function useGameState(consumeFreePlay: () => boolean, hasFreePlays: boolean) {
  // Persistent State
  const [globalCoins, setGlobalCoins] = useState(INITIAL_COINS);
  const [globalRelics, setGlobalRelics] = useState(INITIAL_RELICS);
  const [globalShields, setGlobalShields] = useState(INITIAL_SHIELDS);
  const [bestScore, setBestScore] = useState(0);
  const [streakHeat, setStreakHeat] = useState(0);

  // Run State
  const [status, setStatus] = useState<GameStatus>('idle');
  const [board, setBoard] = useState<TileData[]>([]);
  const [haul, setHaul] = useState(0);
  const [runMultiplier, setRunMultiplier] = useState(1);
  const [runRisk, setRunRisk] = useState(BASE_RISK);
  const [safeDigs, setSafeDigs] = useState(0);

  // Safe Deck Generation (Ensures we don't drop 16 multis)
  const [safeDeck, setSafeDeck] = useState<{type: TileType, val: number}[]>([]);

  // Load from Storage on mount
  useEffect(() => {
    const c = localStorage.getItem(SK_COINS);
    const r = localStorage.getItem(SK_RELICS);
    const s = localStorage.getItem(SK_SHIELDS);
    const b = localStorage.getItem(SK_BEST);
    const h = localStorage.getItem(SK_HEAT);
    
    if (c) setGlobalCoins(parseInt(c));
    if (r) setGlobalRelics(parseInt(r));
    if (s) setGlobalShields(parseInt(s));
    if (b) setBestScore(parseInt(b));
    if (h) setStreakHeat(parseFloat(h));
  }, []);

  // Sync to Storage
  useEffect(() => localStorage.setItem(SK_COINS, globalCoins.toString()), [globalCoins]);
  useEffect(() => localStorage.setItem(SK_RELICS, globalRelics.toString()), [globalRelics]);
  useEffect(() => localStorage.setItem(SK_SHIELDS, globalShields.toString()), [globalShields]);
  useEffect(() => localStorage.setItem(SK_BEST, bestScore.toString()), [bestScore]);
  useEffect(() => localStorage.setItem(SK_HEAT, streakHeat.toString()), [streakHeat]);

  // Generators
  const createInitialBoard = (): TileData[] => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      revealed: false,
      type: 'hidden',
      value: 0
    }));
  };

  const createSafeDeck = () => {
    const deck: {type: TileType, val: number}[] = [];
    // 10 Coins
    [8, 10, 12, 15, 18, 20, 24, 30, 10, 15].forEach(v => deck.push({type: 'coin', val: v}));
    // 3 Relics
    [1, 1, 2].forEach(v => deck.push({type: 'relic', val: v}));
    // 3 Multipliers
    [0.2, 0.4, 0.6].forEach(v => deck.push({type: 'multiplier', val: v}));
    
    // Shuffle
    return deck.sort(() => Math.random() - 0.5);
  };

  const revealAllRemaining = (currentBoard: TileData[]) => {
    // Fill remaining unrevealed with random stuff just for show
    return currentBoard.map(t => {
      if (t.revealed) return t;
      const isTrap = Math.random() < 0.25;
      if (isTrap) return { ...t, revealed: true, type: 'trap', value: 0 };
      return { ...t, revealed: true, type: 'coin', value: 10 };
    });
  };

  // Actions
  const startRun = useCallback(() => {
    if (!hasFreePlays) {
      if (globalCoins < EXTRA_PLAY_COST) return; // Not enough coins
      setGlobalCoins(prev => prev - EXTRA_PLAY_COST);
    } else {
      consumeFreePlay();
    }

    setBoard(createInitialBoard());
    setSafeDeck(createSafeDeck());
    setHaul(0);
    setRunMultiplier(1);
    setSafeDigs(0);
    setRunRisk(Math.min(BASE_RISK + streakHeat, MAX_RISK));
    setStatus('playing');
  }, [hasFreePlays, globalCoins, streakHeat, consumeFreePlay]);

  const digTile = useCallback((index: number) => {
    if (status !== 'playing' || board[index].revealed) return;

    let newBoard = [...board];
    const isTrap = Math.random() < runRisk;

    if (isTrap) {
      if (globalShields > 0) {
        // Shield saves the day
        setGlobalShields(prev => prev - 1);
        setRunRisk(POST_TRAP_RISK);
        setStreakHeat(prev => Math.max(0, prev - CASHOUT_PRESSURE_DROP_ON_TRAP));
        newBoard[index] = { ...newBoard[index], revealed: true, type: 'trap', value: 0, isShieldedTrap: true };
        setBoard(newBoard);
      } else {
        // BOOM
        setStreakHeat(prev => Math.max(0, prev - CASHOUT_PRESSURE_DROP_ON_TRAP));
        newBoard[index] = { ...newBoard[index], revealed: true, type: 'trap', value: 0 };
        newBoard = revealAllRemaining(newBoard);
        setBoard(newBoard);
        setStatus('lost');
      }
      return;
    }

    // Safe dig
    const deck = [...safeDeck];
    let drop = deck.pop();
    if (!drop) {
      // Fallback if deck empty
      drop = { type: 'coin', val: 15 };
    }
    setSafeDeck(deck);

    newBoard[index] = { ...newBoard[index], revealed: true, type: drop.type, value: drop.val };
    setBoard(newBoard);
    
    // Apply rewards
    if (drop.type === 'coin') {
      setHaul(prev => prev + drop.val);
    } else if (drop.type === 'relic') {
      setGlobalRelics(prev => prev + drop.val);
    } else if (drop.type === 'multiplier') {
      setRunMultiplier(prev => prev + drop.val);
    }

    // Increase risk
    setSafeDigs(prev => prev + 1);
    setRunRisk(prev => Math.min(prev + RISK_STEP, MAX_RISK));

  }, [status, board, runRisk, globalShields, safeDeck]);

  const cashOut = useCallback(() => {
    if (status !== 'playing' || haul === 0) return;
    
    const finalHaul = Math.floor(haul * runMultiplier);
    setGlobalCoins(prev => prev + finalHaul);
    if (finalHaul > bestScore) setBestScore(finalHaul);
    
    setStreakHeat(prev => Math.min(prev + CASHOUT_PRESSURE_STEP, MAX_CASHOUT_PRESSURE));
    setStatus('won');
  }, [status, haul, runMultiplier, bestScore]);

  const buyShield = useCallback(() => {
    if (globalCoins >= SHIELD_COST) {
      setGlobalCoins(prev => prev - SHIELD_COST);
      setGlobalShields(prev => prev + 1);
      return true;
    }
    return false;
  }, [globalCoins]);

  return {
    status, board, haul, runMultiplier, runRisk, safeDigs,
    globalCoins, globalRelics, globalShields, bestScore, streakHeat,
    startRun, digTile, cashOut, buyShield,
    canAffordPlay: hasFreePlays || globalCoins >= EXTRA_PLAY_COST
  };
}
