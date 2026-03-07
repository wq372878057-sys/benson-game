// ============================================================
// 星球大战：银河征服者 - 游戏状态管理
// Design: 星云漂流者 (Nebula Drifter)
// ============================================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { GameState, BattleState, TrainingSession } from '../lib/gameTypes';
import { createInitialGameState, getAttackMultiplier, getHeartRateZone, getForceLevel, getForceAlignment } from '../lib/gameEngine';

type GameAction =
  | { type: 'USE_SKILL'; skillId: string }
  | { type: 'EQUIP_GEAR'; gearId: string; characterId: string }
  | { type: 'START_TRAINING'; trainingType: TrainingSession['type'] }
  | { type: 'STOP_TRAINING' }
  | { type: 'UPDATE_HEART_RATE'; bpm: number }
  | { type: 'TICK_TRAINING' }
  | { type: 'START_BATTLE'; missionId: number }
  | { type: 'ATTACK' }
  | { type: 'END_BATTLE' }
  | { type: 'COMPLETE_MISSION'; missionId: number }
  | { type: 'QUICK_ACTION'; action: 'meditate' | 'supply' | 'purify' | 'remind' }
  | { type: 'SYNC_TRAINING_DATA' }
  | { type: 'RESET' };

const trainingTypeNames: Record<TrainingSession['type'], string> = {
  lightsaber: '光剑格斗',
  endurance: '耐力飞行',
  meditation: '原力冥想',
  assault: '战场突袭',
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'USE_SKILL': {
      const skill = state.skills.find(s => s.id === action.skillId);
      if (!skill || !skill.unlocked) return state;
      if (state.force.lightSidePoints < skill.cost && skill.side === 'light') return state;

      let newForce = { ...state.force };
      let newToday = { ...state.today };

      switch (action.skillId) {
        case 'force-sense':
          // Just show a notification effect
          break;
        case 'force-heal':
          newForce.consecutiveDays = Math.min(newForce.consecutiveDays + 1, 81);
          break;
        case 'mind-peace':
          newForce.darkSidePoints = Math.max(0, newForce.darkSidePoints - 15);
          break;
        case 'force-push':
          newToday.lightYears = Math.floor(newToday.lightYears * 1.5);
          break;
        case 'dark-sense':
          break;
        case 'force-lightning':
          break;
      }

      if (skill.side === 'light') {
        newForce.lightSidePoints = Math.max(0, newForce.lightSidePoints - skill.cost);
      } else {
        newForce.darkSidePoints = Math.min(100, newForce.darkSidePoints + 5);
      }

      return { ...state, force: newForce, today: newToday };
    }

    case 'START_TRAINING': {
      return {
        ...state,
        training: {
          ...state.training,
          type: action.trainingType,
          typeName: trainingTypeNames[action.trainingType],
          active: true,
          duration: 0,
          calories: 0,
          lightYears: 0,
        },
      };
    }

    case 'STOP_TRAINING': {
      const gained = Math.floor(state.training.lightYears);
      const forceGained = Math.floor(state.training.calories / 50);
      const newLightPoints = state.force.lightSidePoints + forceGained;
      const levelInfo = getForceLevel(newLightPoints);
      return {
        ...state,
        training: { ...state.training, active: false },
        force: {
          ...state.force,
          lightSidePoints: newLightPoints,
          forceLevel: levelInfo.level,
          forceLevelName: levelInfo.name,
        },
        galaxy: {
          ...state.galaxy,
          totalLightYears: state.galaxy.totalLightYears + gained,
          currentLightYears: state.galaxy.currentLightYears + gained,
        },
        today: {
          ...state.today,
          lightYears: state.today.lightYears + gained,
          forceGained: state.today.forceGained + forceGained,
        },
      };
    }

    case 'TICK_TRAINING': {
      if (!state.training.active) return state;
      const bpm = state.training.heartRate;
      const caloriesPerSec = (bpm / 60) * 0.05;
      const lyPerSec = 0.1;
      return {
        ...state,
        training: {
          ...state.training,
          duration: state.training.duration + 1,
          calories: state.training.calories + caloriesPerSec,
          lightYears: state.training.lightYears + lyPerSec,
          heartRateZone: getHeartRateZone(bpm),
        },
      };
    }

    case 'UPDATE_HEART_RATE': {
      return {
        ...state,
        training: {
          ...state.training,
          heartRate: action.bpm,
          heartRateZone: getHeartRateZone(action.bpm),
        },
        battle: {
          ...state.battle,
          heartRate: action.bpm,
          attackMultiplier: getAttackMultiplier(action.bpm),
        },
      };
    }

    case 'START_BATTLE': {
      const mission = state.missions.find(m => m.id === action.missionId);
      if (!mission) return state;
      return {
        ...state,
        battle: {
          active: true,
          bossName: mission.bossName || '未知敌人',
          bossHp: mission.bossHp || 100,
          bossMaxHp: mission.bossMaxHp || mission.bossHp || 100,
          playerHp: state.characters[0].hp,
          playerMaxHp: state.characters[0].maxHp,
          heartRate: state.training.heartRate,
          attackMultiplier: getAttackMultiplier(state.training.heartRate),
          log: [`战斗开始！${mission.bossName || '敌人'}出现了！`],
          result: null,
        },
      };
    }

    case 'ATTACK': {
      if (!state.battle.active || state.battle.result) return state;
      const multiplier = state.battle.attackMultiplier;
      const baseDmg = state.characters[0].strength;
      const playerDmg = Math.floor(baseDmg * multiplier * (0.8 + Math.random() * 0.4));
      const bossDmg = Math.floor(15 + Math.random() * 20);
      
      const newBossHp = Math.max(0, state.battle.bossHp - playerDmg);
      const newPlayerHp = Math.max(0, state.battle.playerHp - bossDmg);
      
      const newLog = [
        `你发动攻击！造成 ${playerDmg} 点伤害 (×${multiplier.toFixed(1)})`,
        newBossHp > 0 ? `${state.battle.bossName} 反击！你受到 ${bossDmg} 点伤害` : `${state.battle.bossName} 已被击败！`,
        ...state.battle.log.slice(0, 5),
      ];

      const result = newBossHp <= 0 ? 'victory' : newPlayerHp <= 0 ? 'defeat' : null;

      let newForce = { ...state.force };
      if (result === 'victory') {
        newForce.lightSidePoints += 50;
        const levelInfo = getForceLevel(newForce.lightSidePoints);
        newForce.forceLevel = levelInfo.level;
        newForce.forceLevelName = levelInfo.name;
      }

      return {
        ...state,
        battle: {
          ...state.battle,
          bossHp: newBossHp,
          playerHp: newPlayerHp,
          log: newLog,
          result,
        },
        force: newForce,
      };
    }

    case 'END_BATTLE': {
      return {
        ...state,
        battle: { ...state.battle, active: false, result: null },
      };
    }

    case 'COMPLETE_MISSION': {
      const mission = state.missions.find(m => m.id === action.missionId);
      if (!mission) return state;
      
      const newMissions = state.missions.map(m =>
        m.id === action.missionId ? { ...m, status: 'completed' as const } : m
      );
      
      const newLightPoints = state.force.lightSidePoints + mission.reward.forcePoints;
      const levelInfo = getForceLevel(newLightPoints);
      
      return {
        ...state,
        missions: newMissions,
        force: {
          ...state.force,
          lightSidePoints: newLightPoints,
          forceLevel: levelInfo.level,
          forceLevelName: levelInfo.name,
        },
        galaxy: {
          ...state.galaxy,
          completedMissions: [...state.galaxy.completedMissions, action.missionId],
        },
        credits: state.credits + 500,
      };
    }

    case 'QUICK_ACTION': {
      let newForce = { ...state.force };
      switch (action.action) {
        case 'meditate':
          newForce.lightSidePoints += 20;
          break;
        case 'supply':
          newForce.lightSidePoints += 10;
          break;
        case 'purify':
          newForce.darkSidePoints = Math.max(0, newForce.darkSidePoints - 10);
          break;
      }
      const levelInfo = getForceLevel(newForce.lightSidePoints);
      newForce.forceLevel = levelInfo.level;
      newForce.forceLevelName = levelInfo.name;
      newForce.forceAlignment = getForceAlignment(newForce.lightSidePoints, newForce.darkSidePoints);
      newForce.darkSideWarning = newForce.darkSidePoints > 50;
      return { ...state, force: newForce };
    }

    case 'SYNC_TRAINING_DATA': {
      const newSteps = state.today.steps + Math.floor(500 + Math.random() * 1000);
      const newLY = Math.floor(newSteps / 100);
      const newForce = Math.floor(newSteps / 1000) * 10;
      const newLightPoints = state.force.lightSidePoints + 15;
      const levelInfo = getForceLevel(newLightPoints);
      return {
        ...state,
        today: { ...state.today, steps: newSteps, lightYears: newLY, forceGained: newForce },
        force: {
          ...state.force,
          lightSidePoints: newLightPoints,
          forceLevel: levelInfo.level,
          forceLevelName: levelInfo.name,
        },
        galaxy: {
          ...state.galaxy,
          totalLightYears: state.galaxy.totalLightYears + 5,
          currentLightYears: Math.min(state.galaxy.currentLightYears + 5, state.galaxy.stageGoalLightYears),
        },
      };
    }

    case 'RESET':
      return createInitialGameState();

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  useSkill: (skillId: string) => void;
  startTraining: (type: TrainingSession['type']) => void;
  stopTraining: () => void;
  updateHeartRate: (bpm: number) => void;
  startBattle: (missionId: number) => void;
  attack: () => void;
  endBattle: () => void;
  quickAction: (action: 'meditate' | 'supply' | 'purify' | 'remind') => void;
  syncData: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);

  const useSkill = useCallback((skillId: string) => dispatch({ type: 'USE_SKILL', skillId }), []);
  const startTraining = useCallback((type: TrainingSession['type']) => dispatch({ type: 'START_TRAINING', trainingType: type }), []);
  const stopTraining = useCallback(() => dispatch({ type: 'STOP_TRAINING' }), []);
  const updateHeartRate = useCallback((bpm: number) => dispatch({ type: 'UPDATE_HEART_RATE', bpm }), []);
  const startBattle = useCallback((missionId: number) => dispatch({ type: 'START_BATTLE', missionId }), []);
  const attack = useCallback(() => dispatch({ type: 'ATTACK' }), []);
  const endBattle = useCallback(() => dispatch({ type: 'END_BATTLE' }), []);
  const quickAction = useCallback((action: 'meditate' | 'supply' | 'purify' | 'remind') => dispatch({ type: 'QUICK_ACTION', action }), []);
  const syncData = useCallback(() => dispatch({ type: 'SYNC_TRAINING_DATA' }), []);

  return (
    <GameContext.Provider value={{ state, dispatch, useSkill, startTraining, stopTraining, updateHeartRate, startBattle, attack, endBattle, quickAction, syncData }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
