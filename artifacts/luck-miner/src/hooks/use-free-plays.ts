import { useState, useEffect } from 'react';
import { differenceInSeconds, startOfTomorrow } from 'date-fns';

const MAX_FREE_PLAYS = 8;
const STORAGE_KEY = 'luck_miner_free_plays';
const RESET_TIME_KEY = 'luck_miner_next_reset';

export function useFreePlays() {
  const [freePlays, setFreePlays] = useState<number>(MAX_FREE_PLAYS);
  const [secondsUntilReset, setSecondsUntilReset] = useState<number>(0);

  // Initialize and check resets
  useEffect(() => {
    const storedPlays = localStorage.getItem(STORAGE_KEY);
    const storedReset = localStorage.getItem(RESET_TIME_KEY);
    
    const now = new Date();
    const nextMidnight = startOfTomorrow();

    if (!storedReset || new Date(parseInt(storedReset)) <= now) {
      // Need to reset
      setFreePlays(MAX_FREE_PLAYS);
      localStorage.setItem(STORAGE_KEY, MAX_FREE_PLAYS.toString());
      localStorage.setItem(RESET_TIME_KEY, nextMidnight.getTime().toString());
    } else {
      // Still in current day
      if (storedPlays !== null) {
        setFreePlays(parseInt(storedPlays, 10));
      }
    }
  }, []);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      const storedReset = localStorage.getItem(RESET_TIME_KEY);
      if (storedReset) {
        const resetDate = new Date(parseInt(storedReset));
        const now = new Date();
        if (now >= resetDate) {
          // Trigger reset
          setFreePlays(MAX_FREE_PLAYS);
          const nextMidnight = startOfTomorrow();
          localStorage.setItem(STORAGE_KEY, MAX_FREE_PLAYS.toString());
          localStorage.setItem(RESET_TIME_KEY, nextMidnight.getTime().toString());
        } else {
          setSecondsUntilReset(differenceInSeconds(resetDate, now));
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const consumeFreePlay = () => {
    if (freePlays > 0) {
      const newAmount = freePlays - 1;
      setFreePlays(newAmount);
      localStorage.setItem(STORAGE_KEY, newAmount.toString());
      return true;
    }
    return false;
  };

  const formattedTime = new Date(secondsUntilReset * 1000).toISOString().substring(11, 19);

  return {
    freePlays,
    maxFreePlays: MAX_FREE_PLAYS,
    consumeFreePlay,
    timeUntilReset: formattedTime,
    hasFreePlays: freePlays > 0
  };
}
