/**
 * 禅定花园 · Apple Watch 端界面
 * 俯视角佛珠 + 振动反馈模拟 + 表盘复杂功能
 * Design Philosophy: 金碧禅境 - 圆形表盘全屏，极简交互
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZen } from '@/contexts/ZenContext';
import { ZEN_LEVELS, BEAD_STYLES, formatMerit, getLevelProgress } from '@/lib/zenStore';
import BeadCanvas from './BeadCanvas';

type WatchView = 'main' | 'stats' | 'settings' | 'complication';

export default function WatchApp() {
  const [view, setView] = useState<WatchView>('main');
  const { state, addMerit, toggleMusic, toggleVibration, vibrationCount } = useZen();
  const [isVibrating, setIsVibrating] = useState(false);
  const prevVibrationCount = useRef(vibrationCount);
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];
  const progress = getLevelProgress(state.merit, state.currentLevel);

  // 模拟振动反馈
  useEffect(() => {
    if (vibrationCount > prevVibrationCount.current) {
      prevVibrationCount.current = vibrationCount;
      setIsVibrating(true);
      // 尝试使用 Vibration API
      if (navigator.vibrate) {
        if (state.currentLevel <= 3) {
          navigator.vibrate(40);
        } else if (state.currentLevel <= 6) {
          navigator.vibrate([40, 60, 40]);
        } else {
          navigator.vibrate([30, 40, 30, 40, 30]);
        }
      }
      setTimeout(() => setIsVibrating(false), 500);
    }
  }, [vibrationCount, state.currentLevel]);

  const handleDigitalCrown = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      addMerit(1);
    } else if (e.deltaY > 0) {
      addMerit(1);
    }
  }, [addMerit]);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        width: '100%',
        height: '100%',
        background: '#030308',
        borderRadius: 'inherit',
      }}
      onWheel={handleDigitalCrown}
    >
      <AnimatePresence mode="wait">
        {view === 'main' && (
          <motion.div
            key="main"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <MainWatchView
              onSwipeUp={() => setView('stats')}
              onSwipeDown={() => setView('settings')}
              isVibrating={isVibrating}
            />
          </motion.div>
        )}
        {view === 'stats' && (
          <motion.div
            key="stats"
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <WatchStatsView onBack={() => setView('main')} />
          </motion.div>
        )}
        {view === 'settings' && (
          <motion.div
            key="settings"
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <WatchSettingsView onBack={() => setView('main')} />
          </motion.div>
        )}
        {view === 'complication' && (
          <motion.div
            key="complication"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WatchFaceView onBack={() => setView('main')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部导航点 */}
      {view === 'main' && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          <button
            onClick={() => setView('stats')}
            className="w-1.5 h-1.5 rounded-full opacity-40 hover:opacity-80 transition-opacity"
            style={{ background: '#C9A84C' }}
          />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
          <button
            onClick={() => setView('settings')}
            className="w-1.5 h-1.5 rounded-full opacity-40 hover:opacity-80 transition-opacity"
            style={{ background: '#C9A84C' }}
          />
        </div>
      )}
    </div>
  );
}

// 主表盘视图
function MainWatchView({
  onSwipeUp,
  onSwipeDown,
  isVibrating,
}: {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  isVibrating: boolean;
}) {
  const { state, addMerit } = useZen();
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];
  const progress = getLevelProgress(state.merit, state.currentLevel);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy < -40) onSwipeUp();
    else if (dy > 40) onSwipeDown();
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between py-3 px-2"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部境界信息 */}
      <div className="text-center">
        <div className="text-xs font-cinzel" style={{ color: '#C9A84C', fontSize: '9px' }}>
          LV.{state.currentLevel} · {levelInfo.name}
        </div>
      </div>

      {/* 佛珠画布 */}
      <motion.div
        animate={isVibrating ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <BeadCanvas isWatch={true} size={160} />
      </motion.div>

      {/* 功德数 + 进度环 */}
      <div className="text-center">
        <div className="text-lg font-cinzel" style={{ color: '#FFD700', lineHeight: 1 }}>
          {formatMerit(state.merit)}
        </div>
        <div className="text-xs font-serif-sc opacity-50 mt-0.5" style={{ color: '#C9A84C', fontSize: '9px' }}>
          功德
        </div>
        
        {/* 进度条 */}
        <div className="mt-2 w-24 h-1 rounded-full mx-auto overflow-hidden" style={{ background: 'rgba(201,168,76,0.2)' }}>
          <motion.div
            className="h-full rounded-full merit-progress"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

// 统计视图
function WatchStatsView({ onBack }: { onBack: () => void }) {
  const { state } = useZen();
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];

  return (
    <div className="w-full h-full flex flex-col p-3 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="text-xs" style={{ color: '#C9A84C' }}>
          ←
        </button>
        <span className="text-xs font-serif-sc font-bold" style={{ color: '#FFD700' }}>
          今日统计
        </span>
      </div>

      <div className="space-y-2">
        {[
          { label: '本次功德', value: state.sessionMerit.toLocaleString() },
          { label: '累计功德', value: formatMerit(state.merit) },
          { label: '当前境界', value: levelInfo.name },
          { label: '已解锁', value: `${state.unlockedLevels.length}/10 境界` },
        ].map(item => (
          <div
            key={item.label}
            className="flex justify-between items-center p-2 rounded-lg"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <span className="text-xs font-serif-sc opacity-60" style={{ color: '#E8DCC8', fontSize: '10px' }}>
              {item.label}
            </span>
            <span className="text-xs font-serif-sc font-bold" style={{ color: '#C9A84C', fontSize: '10px' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 设置视图
function WatchSettingsView({ onBack }: { onBack: () => void }) {
  const { state, toggleMusic, toggleVibration } = useZen();

  return (
    <div className="w-full h-full flex flex-col p-3">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="text-xs" style={{ color: '#C9A84C' }}>
          ←
        </button>
        <span className="text-xs font-serif-sc font-bold" style={{ color: '#FFD700' }}>
          设置
        </span>
      </div>

      <div className="space-y-2">
        <div
          className="flex justify-between items-center p-2 rounded-lg"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
        >
          <span className="text-xs font-serif-sc" style={{ color: '#E8DCC8', fontSize: '10px' }}>
            音效
          </span>
          <button
            onClick={toggleMusic}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: state.musicEnabled ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)',
              color: state.musicEnabled ? '#FFD700' : '#666',
              fontSize: '10px',
            }}
          >
            {state.musicEnabled ? '开' : '关'}
          </button>
        </div>

        <div
          className="flex justify-between items-center p-2 rounded-lg"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
        >
          <span className="text-xs font-serif-sc" style={{ color: '#E8DCC8', fontSize: '10px' }}>
            振动
          </span>
          <button
            onClick={toggleVibration}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: state.vibrationEnabled ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)',
              color: state.vibrationEnabled ? '#FFD700' : '#666',
              fontSize: '10px',
            }}
          >
            {state.vibrationEnabled ? '开' : '关'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 表盘复杂功能展示
function WatchFaceView({ onBack }: { onBack: () => void }) {
  const { state } = useZen();
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];
  const progress = getLevelProgress(state.merit, state.currentLevel);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative"
      style={{ background: '#030308' }}
    >
      {/* 进度环 */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="4"
        />
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 90}`}
          strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress)}`}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.6))' }}
        />
      </svg>

      {/* 中心内容 */}
      <div className="text-center z-10">
        <div className="text-xs font-cinzel mb-1" style={{ color: '#C9A84C', fontSize: '9px' }}>
          LV.{state.currentLevel}
        </div>
        <div className="text-xl font-cinzel" style={{ color: '#FFD700' }}>
          {formatMerit(state.merit)}
        </div>
        <div className="text-xs font-serif-sc mt-1" style={{ color: '#E8DCC8', opacity: 0.7, fontSize: '9px' }}>
          {levelInfo.name}
        </div>
      </div>

      <button
        onClick={onBack}
        className="absolute bottom-4 text-xs font-serif-sc"
        style={{ color: '#C9A84C', opacity: 0.6 }}
      >
        返回
      </button>
    </div>
  );
}
