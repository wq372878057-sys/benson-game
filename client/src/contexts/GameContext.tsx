/**
 * 水浒传：梁山风云录 - 游戏状态管理
 * Design: 水墨江湖·沉浸叙事
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { GameState, INITIAL_GAME_STATE, getLoyaltyLevel, getAttackMultiplier } from '@/lib/gameData';

type GameAction =
  | { type: 'SYNC_HEALTH'; steps: number; heartRate: number; sleep: number; deepSleep: number; calories: number; activeMinutes: number }
  | { type: 'COMPLETE_BATTLE'; battleId: number; loyaltyReward: number }
  | { type: 'USE_QUICK_ACTION'; action: 'drink' | 'reward' | 'repent' | 'summon' }
  | { type: 'START_WORKOUT' }
  | { type: 'UPDATE_WORKOUT'; heartRate: number; time: number; calories: number; miles: number }
  | { type: 'END_WORKOUT' }
  | { type: 'WATCH_ATTACK' }
  | { type: 'SET_WATCH_SCREEN'; screen: GameState['watchState']['currentScreen'] }
  | { type: 'EQUIP_WEAPON'; heroId: string; weaponId: string }
  | { type: 'ADD_LOYALTY'; amount: number; reason: string };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SYNC_HEALTH': {
      const newHealth = {
        ...state.dailyHealth,
        steps: action.steps,
        heartRateAvg: action.heartRate,
        heartRateMax: Math.max(state.dailyHealth.heartRateMax, action.heartRate),
        sleepHours: action.sleep,
        sleepDeepHours: action.deepSleep,
        caloriesBurned: action.calories,
        activeMinutes: action.activeMinutes,
      };
      const stepsLoyalty = Math.min(Math.floor(action.steps / 1000) * 10, 100);
      const sleepBonus = action.deepSleep >= 2 ? 30 : 0;
      let streakBonus = 0;
      if (state.consecutiveDays >= 7) streakBonus = 20;
      else if (state.consecutiveDays >= 3) streakBonus = 10;
      const newLoyalty = state.loyaltyValue + stepsLoyalty + sleepBonus + streakBonus;
      const newMiles = state.totalMiles + Math.floor(action.steps / 100);
      
      // Evil value calculation
      let evilChange = 0;
      if (action.steps < newHealth.stepGoal * 0.5) evilChange += 10;
      if (action.steps >= newHealth.stepGoal) evilChange -= 20;
      const newEvil = Math.max(0, Math.min(100, state.evilValue + evilChange));
      
      // Update heroes morale based on steps
      const updatedHeroes = state.heroes.map(hero => {
        if (hero.id === 'likui') {
          return { ...hero, morale: action.steps >= newHealth.stepGoal ? '高昂' as const : '低落' as const };
        }
        return hero;
      });

      return {
        ...state,
        dailyHealth: newHealth,
        loyaltyValue: newLoyalty,
        loyaltyLevel: getLoyaltyLevel(newLoyalty),
        totalMiles: newMiles,
        evilValue: newEvil,
        heroes: updatedHeroes,
      };
    }

    case 'COMPLETE_BATTLE': {
      const newLoyalty = state.loyaltyValue + action.loyaltyReward;
      const newCompleted = [...state.completedBattles, action.battleId];
      const newBattles = state.battles.map(b => {
        if (b.id === action.battleId) return { ...b, status: 'completed' as const };
        if (b.id === action.battleId + 1) return { ...b, status: 'active' as const };
        return b;
      });
      return {
        ...state,
        loyaltyValue: newLoyalty,
        loyaltyLevel: getLoyaltyLevel(newLoyalty),
        completedBattles: newCompleted,
        currentBattle: action.battleId + 1,
        battles: newBattles,
        evilValue: 0,
      };
    }

    case 'USE_QUICK_ACTION': {
      let loyaltyChange = 0;
      let evilChange = 0;
      switch (action.action) {
        case 'drink': loyaltyChange = 20; break;
        case 'reward': loyaltyChange = 10; break;
        case 'repent': evilChange = -10; break;
        case 'summon': break;
      }
      return {
        ...state,
        loyaltyValue: state.loyaltyValue + loyaltyChange,
        loyaltyLevel: getLoyaltyLevel(state.loyaltyValue + loyaltyChange),
        evilValue: Math.max(0, state.evilValue + evilChange),
      };
    }

    case 'START_WORKOUT': {
      return {
        ...state,
        watchState: {
          ...state.watchState,
          workoutActive: true,
          workoutTime: 0,
          workoutCalories: 0,
          workoutMiles: 0,
          currentScreen: 'workout',
        },
      };
    }

    case 'UPDATE_WORKOUT': {
      return {
        ...state,
        watchState: {
          ...state.watchState,
          currentHeartRate: action.heartRate,
          workoutTime: action.time,
          workoutCalories: action.calories,
          workoutMiles: action.miles,
        },
      };
    }

    case 'END_WORKOUT': {
      const workoutLoyalty = Math.floor(state.watchState.workoutCalories / 10);
      return {
        ...state,
        loyaltyValue: state.loyaltyValue + workoutLoyalty,
        loyaltyLevel: getLoyaltyLevel(state.loyaltyValue + workoutLoyalty),
        watchState: {
          ...state.watchState,
          workoutActive: false,
          currentScreen: 'dial',
        },
      };
    }

    case 'WATCH_ATTACK': {
      const multiplier = getAttackMultiplier(state.watchState.currentHeartRate);
      const baseDamage = 50 + Math.floor(Math.random() * 30);
      const damage = Math.floor(baseDamage * multiplier);
      const enemyCounterDamage = 20 + Math.floor(Math.random() * 15);
      
      const newEnemyHp = Math.max(0, state.watchState.battleEnemyHp - damage);
      const newHeroHp = Math.max(0, state.watchState.battleHeroHp - enemyCounterDamage);
      
      const newLog = [
        `鲁智深发动攻击（×${multiplier}），造成 ${damage} 点伤害！`,
        newEnemyHp <= 0 ? '首恶已除！梁山大胜！' : `${state.watchState.battleEnemyName} 反击，造成 ${enemyCounterDamage} 点伤害！`,
      ];

      if (newEnemyHp <= 0) {
        return {
          ...state,
          loyaltyValue: state.loyaltyValue + 50,
          loyaltyLevel: getLoyaltyLevel(state.loyaltyValue + 50),
          watchState: {
            ...state.watchState,
            battleEnemyHp: 0,
            battleHeroHp: newHeroHp,
            battleLog: newLog,
          },
        };
      }

      return {
        ...state,
        watchState: {
          ...state.watchState,
          battleEnemyHp: newEnemyHp,
          battleHeroHp: newHeroHp,
          battleLog: newLog,
        },
      };
    }

    case 'SET_WATCH_SCREEN': {
      return {
        ...state,
        watchState: { ...state.watchState, currentScreen: action.screen },
      };
    }

    case 'EQUIP_WEAPON': {
      const updatedHeroes = state.heroes.map(h =>
        h.id === action.heroId ? { ...h, equippedWeapon: action.weaponId } : h
      );
      return { ...state, heroes: updatedHeroes };
    }

    case 'ADD_LOYALTY': {
      const newLoyalty = state.loyaltyValue + action.amount;
      return {
        ...state,
        loyaltyValue: newLoyalty,
        loyaltyLevel: getLoyaltyLevel(newLoyalty),
      };
    }

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  syncHealth: (steps: number, hr: number, sleep: number, deepSleep: number, cal: number, active: number) => void;
  completeBattle: (battleId: number, reward: number) => void;
  quickAction: (action: 'drink' | 'reward' | 'repent' | 'summon') => void;
  startWorkout: () => void;
  endWorkout: () => void;
  watchAttack: () => void;
  setWatchScreen: (screen: GameState['watchState']['currentScreen']) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  // Simulate heart rate changes during workout
  useEffect(() => {
    if (!state.watchState.workoutActive) return;
    const interval = setInterval(() => {
      const baseHr = 120 + Math.floor(Math.random() * 40);
      const newTime = state.watchState.workoutTime + 1;
      const newCal = state.watchState.workoutCalories + 0.15;
      const newMiles = state.watchState.workoutMiles + 0.003;
      dispatch({ type: 'UPDATE_WORKOUT', heartRate: baseHr, time: newTime, calories: newCal, miles: newMiles });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.watchState.workoutActive, state.watchState.workoutTime, state.watchState.workoutCalories, state.watchState.workoutMiles]);

  const syncHealth = useCallback((steps: number, hr: number, sleep: number, deepSleep: number, cal: number, active: number) => {
    dispatch({ type: 'SYNC_HEALTH', steps, heartRate: hr, sleep, deepSleep, calories: cal, activeMinutes: active });
  }, []);

  const completeBattle = useCallback((battleId: number, reward: number) => {
    dispatch({ type: 'COMPLETE_BATTLE', battleId, loyaltyReward: reward });
  }, []);

  const quickAction = useCallback((action: 'drink' | 'reward' | 'repent' | 'summon') => {
    dispatch({ type: 'USE_QUICK_ACTION', action });
  }, []);

  const startWorkout = useCallback(() => {
    dispatch({ type: 'START_WORKOUT' });
  }, []);

  const endWorkout = useCallback(() => {
    dispatch({ type: 'END_WORKOUT' });
  }, []);

  const watchAttack = useCallback(() => {
    dispatch({ type: 'WATCH_ATTACK' });
  }, []);

  const setWatchScreen = useCallback((screen: GameState['watchState']['currentScreen']) => {
    dispatch({ type: 'SET_WATCH_SCREEN', screen });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, syncHealth, completeBattle, quickAction, startWorkout, endWorkout, watchAttack, setWatchScreen }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
