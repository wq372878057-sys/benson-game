/**
 * 三国演义：乱世英杰录 — 游戏状态上下文
 * 提供全局游戏状态管理与操作方法
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  GameState,
  initialGameState,
  getPrestigeLevel,
  calcDailyPower,
  stepsToMileage,
} from '@/lib/gameStore';

type GameAction =
  | { type: 'SYNC_DATA' }
  | { type: 'ADD_POWER'; amount: number }
  | { type: 'ADD_FATIGUE'; amount: number }
  | { type: 'REDUCE_FATIGUE'; amount: number }
  | { type: 'SET_WATCH_MODE'; mode: GameState['watchMode'] }
  | { type: 'START_MILITARY' }
  | { type: 'STOP_MILITARY' }
  | { type: 'TICK_MILITARY' }
  | { type: 'START_BATTLE' }
  | { type: 'ATTACK_BATTLE' }
  | { type: 'END_BATTLE'; victory: boolean }
  | { type: 'QUICK_ACTION'; action: 'order' | 'reward' | 'comfort' | 'scout' }
  | { type: 'COMPLETE_CAMPAIGN'; campaignId: number }
  | { type: 'UPDATE_STEPS'; steps: number }
  | { type: 'UPDATE_HEART_RATE'; bpm: number };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SYNC_DATA': {
      const newSteps = Math.min(state.todaySteps + Math.floor(Math.random() * 500 + 200), 12000);
      const newHR = Math.floor(Math.random() * 30 + 60);
      const power = calcDailyPower(newSteps, state.todaySleepHours, state.consecutiveDays, 0);
      const mileage = stepsToMileage(newSteps);
      const fatigue = newSteps >= state.stepGoal * 0.5
        ? Math.max(0, state.fatigueValue - 5)
        : Math.min(100, state.fatigueValue + 2);
      const newPower = state.nationalPower + Math.floor(Math.random() * 20 + 10);
      return {
        ...state,
        todaySteps: newSteps,
        todayHeartRate: newHR,
        nationalPower: newPower,
        fatigueValue: fatigue,
        prestigeLevel: getPrestigeLevel(newPower),
      };
    }

    case 'ADD_POWER':
      return {
        ...state,
        nationalPower: state.nationalPower + action.amount,
        prestigeLevel: getPrestigeLevel(state.nationalPower + action.amount),
      };

    case 'ADD_FATIGUE':
      return { ...state, fatigueValue: Math.min(100, state.fatigueValue + action.amount) };

    case 'REDUCE_FATIGUE':
      return { ...state, fatigueValue: Math.max(0, state.fatigueValue - action.amount) };

    case 'SET_WATCH_MODE':
      return { ...state, watchMode: action.mode };

    case 'START_MILITARY':
      return { ...state, militaryRunning: true, militaryTimer: 0 };

    case 'STOP_MILITARY':
      return {
        ...state,
        militaryRunning: false,
        nationalPower: state.nationalPower + Math.floor(state.militaryTimer / 60) * 5,
      };

    case 'TICK_MILITARY':
      return state.militaryRunning
        ? { ...state, militaryTimer: state.militaryTimer + 1 }
        : state;

    case 'START_BATTLE': {
      const currentCamp = state.campaigns.find(c => c.id === state.currentCampaign);
      return {
        ...state,
        battlePhase: 'fighting',
        battlePlayerHp: state.warlords[0].hp,
        battleEnemyHp: currentCamp?.enemyHp || 650,
        battleLog: ['战斗开始！'],
      };
    }

    case 'ATTACK_BATTLE': {
      if (state.battlePhase !== 'fighting') return state;
      const hrMultiplier = state.todayMaxHeartRate > 150 ? 1.5 : state.todayMaxHeartRate > 130 ? 1.2 : 1.0;
      const playerDmg = Math.floor((Math.random() * 80 + 60) * hrMultiplier);
      const enemyDmg = Math.floor(Math.random() * 60 + 40);
      const newEnemyHp = Math.max(0, state.battleEnemyHp - playerDmg);
      const newPlayerHp = Math.max(0, state.battlePlayerHp - enemyDmg);
      const newLog = [
        `我军攻击！造成 ${playerDmg} 点伤害（×${hrMultiplier.toFixed(1)} 心率加成）`,
        `敌军反击！我军受到 ${enemyDmg} 点伤害`,
        ...state.battleLog.slice(0, 4),
      ];

      if (newEnemyHp <= 0) {
        return {
          ...state,
          battleEnemyHp: 0,
          battlePhase: 'victory',
          battleLog: ['敌将已授首！大获全胜！', ...newLog],
          nationalPower: state.nationalPower + 50,
        };
      }
      if (newPlayerHp <= 0) {
        return {
          ...state,
          battlePlayerHp: 0,
          battlePhase: 'defeat',
          battleLog: ['我军败退！需重整旗鼓。', ...newLog],
        };
      }
      return {
        ...state,
        battleEnemyHp: newEnemyHp,
        battlePlayerHp: newPlayerHp,
        battleLog: newLog,
      };
    }

    case 'END_BATTLE':
      return {
        ...state,
        battlePhase: 'idle',
        battleLog: [],
      };

    case 'QUICK_ACTION': {
      const actions = {
        order: { power: 20, fatigue: 0, label: '发布军令' },
        reward: { power: 10, fatigue: 0, label: '犒赏三军' },
        comfort: { power: 0, fatigue: -10, label: '安抚民心' },
        scout: { power: 5, fatigue: 0, label: '侦查敌情' },
      };
      const a = actions[action.action];
      return {
        ...state,
        nationalPower: state.nationalPower + a.power,
        fatigueValue: Math.max(0, state.fatigueValue + a.fatigue),
        prestigeLevel: getPrestigeLevel(state.nationalPower + a.power),
      };
    }

    case 'COMPLETE_CAMPAIGN': {
      const camp = state.campaigns.find(c => c.id === action.campaignId);
      if (!camp) return state;
      const newPower = state.nationalPower + camp.reward.power;
      const updatedCampaigns = state.campaigns.map(c => {
        if (c.id === action.campaignId) return { ...c, status: 'completed' as const };
        if (c.id === action.campaignId + 1) return { ...c, status: 'active' as const };
        return c;
      });
      return {
        ...state,
        nationalPower: newPower,
        prestigeLevel: getPrestigeLevel(newPower),
        completedCampaigns: [...state.completedCampaigns, action.campaignId],
        currentCampaign: action.campaignId + 1,
        campaigns: updatedCampaigns,
        fatigueValue: 0,
      };
    }

    case 'UPDATE_STEPS':
      return { ...state, todaySteps: action.steps };

    case 'UPDATE_HEART_RATE':
      return {
        ...state,
        todayHeartRate: action.bpm,
        todayMaxHeartRate: Math.max(state.todayMaxHeartRate, action.bpm),
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  syncData: () => void;
  addPower: (amount: number) => void;
  quickAction: (action: 'order' | 'reward' | 'comfort' | 'scout') => void;
  setWatchMode: (mode: GameState['watchMode']) => void;
  startBattle: () => void;
  attackBattle: () => void;
  endBattle: (victory: boolean) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const syncData = useCallback(() => dispatch({ type: 'SYNC_DATA' }), []);
  const addPower = useCallback((amount: number) => dispatch({ type: 'ADD_POWER', amount }), []);
  const quickAction = useCallback((action: 'order' | 'reward' | 'comfort' | 'scout') =>
    dispatch({ type: 'QUICK_ACTION', action }), []);
  const setWatchMode = useCallback((mode: GameState['watchMode']) =>
    dispatch({ type: 'SET_WATCH_MODE', mode }), []);
  const startBattle = useCallback(() => dispatch({ type: 'START_BATTLE' }), []);
  const attackBattle = useCallback(() => dispatch({ type: 'ATTACK_BATTLE' }), []);
  const endBattle = useCallback((victory: boolean) => dispatch({ type: 'END_BATTLE', victory }), []);

  return (
    <GameContext.Provider value={{
      state, dispatch, syncData, addPower, quickAction,
      setWatchMode, startBattle, attackBattle, endBattle,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
