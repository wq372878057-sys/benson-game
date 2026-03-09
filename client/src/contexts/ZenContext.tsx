/**
 * 禅定花园 · 全局状态管理
 * Design Philosophy: 金碧禅境 - 克制与专注，数据仅属于自己
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  checkLevelUp,
  getCurrentLevel,
  loadState,
  saveState,
  type ZenState,
} from '@/lib/zenStore';
import { playBeadSound, playLevelUpSound, playRoundCompleteSound, setMusicTheme, startBackgroundMusic, stopBackgroundMusic } from '@/lib/audioEngine';
import { getBeadStyle } from '@/lib/zenStore';

interface ZenContextType {
  state: ZenState;
  addMerit: (amount?: number) => void;
  selectBead: (id: 'bodhi' | 'lapis' | 'agate') => void;
  toggleMusic: () => void;
  toggleVibration: () => void;
  unlockPremium: () => void;
  isLevelingUp: boolean;
  newLevel: number | null;
  dismissLevelUp: () => void;
  showPaywall: boolean;
  dismissPaywall: () => void;
  vibrationCount: number;
}

const ZenContext = createContext<ZenContextType | null>(null);

export function ZenProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ZenState>(() => loadState());
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [vibrationCount, setVibrationCount] = useState(0);
  const beadCountRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 自动保存
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveState(state);
    }, 1000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  // 背景音乐
  useEffect(() => {
    if (state.musicEnabled) {
      const levelInfo = state.currentLevel <= 3 ? 'dawn-bell' 
        : state.currentLevel <= 6 ? 'brahma-chant'
        : state.currentLevel <= 8 ? 'lotus-pond'
        : 'celestial-music';
      startBackgroundMusic(levelInfo as any);
    } else {
      stopBackgroundMusic();
    }
    return () => stopBackgroundMusic();
  }, [state.musicEnabled, state.currentLevel]);

  const addMerit = useCallback((amount = 1) => {
    setState(prev => {
      const newMerit = prev.merit + amount;
      const newTotalBeads = prev.totalBeads + amount;
      const newSessionMerit = prev.sessionMerit + amount;
      const newSessionBeads = prev.sessionBeads + amount;

      // 检查升级
      const newLevelNum = getCurrentLevel(newMerit);
      const levelChanged = newLevelNum > prev.currentLevel;

      // 检查是否需要显示付费墙（到达Lv.3门槛但未付费）
      if (newLevelNum >= 3 && !prev.isPremium && prev.currentLevel < 3) {
        setTimeout(() => setShowPaywall(true), 500);
      }

      // 播放音效
      const bead = getBeadStyle(prev.selectedBead);
      beadCountRef.current += amount;
      const isMother = beadCountRef.current % 18 === 0;
      playBeadSound(bead.soundFreq, bead.soundType as any, bead.soundDuration, isMother);

      // 每100颗触发仪式音效
      const prevHundreds = Math.floor(prev.totalBeads / 100);
      const newHundreds = Math.floor(newTotalBeads / 100);
      if (newHundreds > prevHundreds) {
        playRoundCompleteSound();
        setVibrationCount(c => c + 1);
      }

      // 升级处理
      if (levelChanged) {
        const unlockedLevels = prev.unlockedLevels.includes(newLevelNum)
          ? prev.unlockedLevels
          : [...prev.unlockedLevels, newLevelNum];

        setTimeout(() => {
          playLevelUpSound();
          setIsLevelingUp(true);
          setNewLevel(newLevelNum);
        }, 100);

        return {
          ...prev,
          merit: newMerit,
          totalBeads: newTotalBeads,
          sessionMerit: newSessionMerit,
          sessionBeads: newSessionBeads,
          currentLevel: newLevelNum,
          unlockedLevels,
          levelUpHistory: [
            ...prev.levelUpHistory,
            { level: newLevelNum, timestamp: Date.now() },
          ],
        };
      }

      return {
        ...prev,
        merit: newMerit,
        totalBeads: newTotalBeads,
        sessionMerit: newSessionMerit,
        sessionBeads: newSessionBeads,
      };
    });
  }, []);

  const selectBead = useCallback((id: 'bodhi' | 'lapis' | 'agate') => {
    setState(prev => ({ ...prev, selectedBead: id }));
  }, []);

  const toggleMusic = useCallback(() => {
    setState(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  }, []);

  const toggleVibration = useCallback(() => {
    setState(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  }, []);

  const unlockPremium = useCallback(() => {
    setState(prev => ({ ...prev, isPremium: true }));
    setShowPaywall(false);
  }, []);

  const dismissLevelUp = useCallback(() => {
    setIsLevelingUp(false);
    setNewLevel(null);
  }, []);

  const dismissPaywall = useCallback(() => {
    setShowPaywall(false);
  }, []);

  return (
    <ZenContext.Provider value={{
      state,
      addMerit,
      selectBead,
      toggleMusic,
      toggleVibration,
      unlockPremium,
      isLevelingUp,
      newLevel,
      dismissLevelUp,
      showPaywall,
      dismissPaywall,
      vibrationCount,
    }}>
      {children}
    </ZenContext.Provider>
  );
}

export function useZen() {
  const ctx = useContext(ZenContext);
  if (!ctx) throw new Error('useZen must be used within ZenProvider');
  return ctx;
}
