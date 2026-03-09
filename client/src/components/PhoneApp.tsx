/**
 * 禅定花园 · iPhone 端界面
 * 禅堂场景 + 佛珠 + 图鉴 + 统计
 * Design Philosophy: 金碧禅境 - 全屏沉浸式，场景图占据主视觉
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZen } from '@/contexts/ZenContext';
import { ZEN_LEVELS, BEAD_STYLES, formatMerit, getLevelProgress, getNextLevelMerit } from '@/lib/zenStore';
import BeadCanvas from './BeadCanvas';

type PhoneTab = 'temple' | 'beads' | 'collection' | 'stats';

// 粒子系统组件
function ParticleSystem({ color, active }: { color: string; active: boolean }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    size: 2 + Math.random() * 4,
  }));

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '0%',
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: 0.7,
          }}
          animate={{
            y: [0, -200 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0.7, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// 升级动画组件
function LevelUpOverlay({ level, onDismiss }: { level: number; onDismiss: () => void }) {
  const levelInfo = ZEN_LEVELS.find(l => l.level === level);
  if (!levelInfo) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 金光爆发背景 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, rgba(255,215,0,0.6) 0%, rgba(201,168,76,0.3) 40%, transparent 70%)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: [0, 1, 0.5] }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* 粒子爆发 */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C9A84C' : '#FFFFFF',
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((i / 30) * Math.PI * 2) * (80 + Math.random() * 120),
            y: Math.sin((i / 30) * Math.PI * 2) * (80 + Math.random() * 120),
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      ))}

      {/* 升级弹窗 */}
      <motion.div
        className="relative z-10 mx-6 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,20,40,0.97), rgba(3,3,8,0.98))',
          border: '1px solid rgba(201,168,76,0.5)',
          boxShadow: '0 0 40px rgba(201,168,76,0.3), 0 20px 60px rgba(0,0,0,0.8)',
        }}
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        {/* 场景预览 */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={levelInfo.sceneImage}
            alt={levelInfo.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 scene-overlay" />
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <div className="text-xs font-cinzel" style={{ color: '#C9A84C' }}>
              LEVEL {level}
            </div>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="text-xs mb-1 font-serif-sc" style={{ color: '#C9A84C' }}>
            境界升华
          </div>
          <h2 className="text-2xl font-serif-sc font-black mb-1 glow-gold" style={{ color: '#FFD700' }}>
            {levelInfo.name}
          </h2>
          <p className="text-sm mb-4 font-serif-sc" style={{ color: '#E8DCC8', opacity: 0.8 }}>
            {levelInfo.subtitle}
          </p>
          <div
            className="text-sm mb-6 px-4 py-3 rounded-lg font-serif-sc italic"
            style={{
              color: '#E8DCC8',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            「{levelInfo.verse}」
          </div>
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl font-serif-sc font-bold text-sm btn-zen-gold"
          >
            继续修行
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 付费墙组件
function PaywallOverlay({ onPurchase, onDismiss }: { onPurchase: () => void; onDismiss: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(3,3,8,0.85)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(15,20,40,0.99), rgba(3,3,8,1))',
          border: '1px solid rgba(201,168,76,0.3)',
          borderBottom: 'none',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🪷</div>
            <h2 className="text-xl font-serif-sc font-black mb-1" style={{ color: '#FFD700' }}>
              慧根初开，境界待启
            </h2>
            <p className="text-sm font-serif-sc" style={{ color: '#E8DCC8', opacity: 0.7 }}>
              您的修行已积累足够功德，更高境界正在等待
            </p>
          </div>

          {/* 境界预览轮播 */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {ZEN_LEVELS.slice(2).map(level => (
              <div
                key={level.level}
                className="flex-shrink-0 w-20 rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(201,168,76,0.3)' }}
              >
                <div className="relative h-24">
                  <img src={level.sceneImage} alt={level.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-1 left-0 right-0 text-center">
                    <span className="text-xs font-serif-sc" style={{ color: '#FFD700', fontSize: '9px' }}>
                      {level.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 价格 */}
          <div className="text-center mb-4">
            <span className="text-sm font-serif-sc" style={{ color: '#E8DCC8', opacity: 0.6 }}>
              一次解锁，永久拥有
            </span>
          </div>

          <button
            onClick={onPurchase}
            className="w-full py-4 rounded-2xl font-serif-sc font-bold text-base btn-zen-gold mb-3"
          >
            开启慧根 · ¥8
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-3 text-sm font-serif-sc"
            style={{ color: '#E8DCC8', opacity: 0.5 }}
          >
            继续修行免费境界
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 禅堂场景标签页
function TempleTab() {
  const { state } = useZen();
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];
  const progress = getLevelProgress(state.merit, state.currentLevel);
  const nextMerit = getNextLevelMerit(state.currentLevel);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* 场景图 */}
      <motion.div
        key={state.currentLevel}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img
          src={levelInfo.sceneImage}
          alt={levelInfo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 scene-overlay" />
      </motion.div>

      {/* 粒子效果 */}
      <ParticleSystem color={levelInfo.particleColor} active={true} />

      {/* 顶部信息 */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        <div>
          <div className="text-xs font-cinzel opacity-60" style={{ color: '#C9A84C' }}>
            LV.{state.currentLevel}
          </div>
          <div className="text-lg font-serif-sc font-black glow-gold-sm" style={{ color: '#FFD700' }}>
            {levelInfo.name}
          </div>
          <div className="text-xs font-serif-sc opacity-70" style={{ color: '#E8DCC8' }}>
            {levelInfo.subtitle}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-serif-sc opacity-60" style={{ color: '#C9A84C' }}>
            累计功德
          </div>
          <div className="text-xl font-cinzel animate-shimmer">
            {formatMerit(state.merit)}
          </div>
        </div>
      </div>

      {/* 底部进度 */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-serif-sc opacity-60" style={{ color: '#E8DCC8' }}>
            {levelInfo.atmosphere}
          </span>
          {state.currentLevel < 10 && (
            <span className="text-xs font-serif-sc" style={{ color: '#C9A84C' }}>
              {formatMerit(nextMerit - state.merit)} 功德升级
            </span>
          )}
        </div>
        {state.currentLevel < 10 && (
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(201,168,76,0.2)' }}>
            <motion.div
              className="h-full rounded-full merit-progress"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
        {state.currentLevel >= 10 && (
          <div className="text-center text-sm font-serif-sc glow-gold" style={{ color: '#FFD700' }}>
            南无阿弥陀佛 · 功德圆满
          </div>
        )}
      </div>
    </div>
  );
}

// 图鉴标签页
function CollectionTab() {
  const { state } = useZen();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-center text-lg font-serif-sc font-black mb-4 glow-gold-sm" style={{ color: '#FFD700' }}>
        禅堂图鉴
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {ZEN_LEVELS.map(level => {
          const isUnlocked = state.unlockedLevels.includes(level.level);
          const isCurrent = level.level === state.currentLevel;

          return (
            <motion.div
              key={level.level}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                border: isCurrent
                  ? '2px solid #FFD700'
                  : isUnlocked
                  ? '1px solid rgba(201,168,76,0.4)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: isCurrent ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
            >
              <div className="relative h-28">
                <img
                  src={level.sceneImage}
                  alt={level.name}
                  className="w-full h-full object-cover"
                  style={{ filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.3)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl opacity-50">🔒</div>
                  </div>
                )}
                {isCurrent && (
                  <div
                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-serif-sc"
                    style={{ background: '#FFD700', color: '#030308' }}
                  >
                    当前
                  </div>
                )}
              </div>
              <div className="p-2" style={{ background: 'rgba(15,20,40,0.9)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-cinzel" style={{ color: '#C9A84C' }}>
                    Lv.{level.level}
                  </span>
                  {!isUnlocked && (
                    <span className="text-xs font-serif-sc" style={{ color: '#E8DCC8', opacity: 0.5 }}>
                      {formatMerit(level.requiredMerit)}
                    </span>
                  )}
                </div>
                <div className="text-sm font-serif-sc font-bold" style={{ color: isUnlocked ? '#E8DCC8' : '#666' }}>
                  {level.name}
                </div>
              </div>

              {/* 展开的偈语 */}
              <AnimatePresence>
                {selectedLevel === level.level && isUnlocked && (
                  <motion.div
                    className="px-3 pb-3"
                    style={{ background: 'rgba(15,20,40,0.9)' }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="zen-divider mb-2" />
                    <p className="text-xs font-serif-sc italic" style={{ color: '#C9A84C' }}>
                      「{level.verse}」
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 统计标签页
function StatsTab() {
  const { state } = useZen();
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];
  const progress = getLevelProgress(state.merit, state.currentLevel);

  const stats = [
    { label: '累计功德', value: formatMerit(state.merit), icon: '✨' },
    { label: '当前境界', value: levelInfo.name, icon: '🏯' },
    { label: '本次会话', value: state.sessionMerit.toLocaleString(), icon: '🎯' },
    { label: '已解锁境界', value: `${state.unlockedLevels.length}/10`, icon: '🔓' },
    { label: '总拨珠次数', value: state.totalBeads.toLocaleString(), icon: '📿' },
    { label: '升级进度', value: `${(progress * 100).toFixed(1)}%`, icon: '📈' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-center text-lg font-serif-sc font-black mb-4 glow-gold-sm" style={{ color: '#FFD700' }}>
        修行统计
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="zen-card rounded-2xl p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-xs font-serif-sc opacity-60 mb-1" style={{ color: '#E8DCC8' }}>
              {stat.label}
            </div>
            <div className="text-sm font-serif-sc font-bold" style={{ color: '#C9A84C' }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 修行里程碑时间线 */}
      <h3 className="text-sm font-serif-sc font-bold mb-3" style={{ color: '#C9A84C' }}>
        修行里程碑
      </h3>
      <div className="space-y-2">
        {ZEN_LEVELS.map(level => {
          const isUnlocked = state.unlockedLevels.includes(level.level);
          const historyEntry = state.levelUpHistory.find(h => h.level === level.level);

          return (
            <div
              key={level.level}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: isUnlocked ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isUnlocked ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-cinzel flex-shrink-0"
                style={{
                  background: isUnlocked ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                  color: isUnlocked ? '#FFD700' : '#666',
                  border: `1px solid ${isUnlocked ? '#C9A84C' : 'transparent'}`,
                }}
              >
                {level.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-serif-sc" style={{ color: isUnlocked ? '#E8DCC8' : '#555' }}>
                  {level.name}
                </div>
                <div className="text-xs opacity-60" style={{ color: '#C9A84C' }}>
                  {isUnlocked
                    ? historyEntry
                      ? new Date(historyEntry.timestamp).toLocaleDateString('zh-CN')
                      : '已解锁'
                    : `需 ${formatMerit(level.requiredMerit)} 功德`}
                </div>
              </div>
              {isUnlocked && <div className="text-sm">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 主 iPhone 应用组件
export default function PhoneApp() {
  const [activeTab, setActiveTab] = useState<PhoneTab>('temple');
  const { state, isLevelingUp, newLevel, dismissLevelUp, showPaywall, dismissPaywall, unlockPremium, toggleMusic } = useZen();

  const tabs = [
    { id: 'temple' as PhoneTab, label: '禅堂', icon: '🏯' },
    { id: 'beads' as PhoneTab, label: '佛珠', icon: '📿' },
    { id: 'collection' as PhoneTab, label: '图鉴', icon: '📖' },
    { id: 'stats' as PhoneTab, label: '统计', icon: '📊' },
  ];

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: '100%',
        height: '100%',
        background: '#030308',
      }}
    >
      {/* 顶部状态栏 */}
      <div
        className="flex justify-between items-center px-4 py-2 flex-shrink-0"
        style={{
          background: 'rgba(3,3,8,0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <div className="text-xs font-cinzel" style={{ color: '#C9A84C' }}>
          禅定花园
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className="text-xs"
            style={{ color: state.musicEnabled ? '#C9A84C' : '#555' }}
          >
            {state.musicEnabled ? '♪' : '♪̶'}
          </button>
          <div className="text-xs font-cinzel" style={{ color: '#C9A84C' }}>
            {formatMerit(state.merit)}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'temple' && (
            <motion.div
              key="temple"
              className="flex-1 flex flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TempleTab />
            </motion.div>
          )}
          {activeTab === 'beads' && (
            <motion.div
              key="beads"
              className="flex-1 flex flex-col items-center justify-center overflow-hidden"
              style={{ background: '#030308' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BeadsTab />
            </motion.div>
          )}
          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              className="flex-1 flex flex-col overflow-hidden"
              style={{ background: '#030308' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CollectionTab />
            </motion.div>
          )}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              className="flex-1 flex flex-col overflow-hidden"
              style={{ background: '#030308' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StatsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部导航 */}
      <div
        className="flex-shrink-0 flex justify-around items-center py-2 px-2"
        style={{
          background: 'rgba(3,3,8,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: activeTab === tab.id ? 'rgba(201,168,76,0.15)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
            }}
          >
            <span className="text-base">{tab.icon}</span>
            <span
              className="text-xs font-serif-sc"
              style={{ color: activeTab === tab.id ? '#C9A84C' : '#555' }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* 升级动画覆盖层 */}
      <AnimatePresence>
        {isLevelingUp && newLevel && (
          <LevelUpOverlay level={newLevel} onDismiss={dismissLevelUp} />
        )}
      </AnimatePresence>

      {/* 付费墙覆盖层 */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallOverlay onPurchase={unlockPremium} onDismiss={dismissPaywall} />
        )}
      </AnimatePresence>
    </div>
  );
}

// 佛珠标签页
function BeadsTab() {
  const { state, selectBead } = useZen();
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-auto py-4">
      {/* 功德计数 */}
      <div className="text-center mb-4">
        <div className="text-xs font-serif-sc opacity-60 mb-1" style={{ color: '#C9A84C' }}>
          本次会话功德
        </div>
        <div className="text-3xl font-cinzel animate-shimmer">
          {state.sessionMerit.toLocaleString()}
        </div>
      </div>

      {/* 佛珠画布 */}
      <div className="relative">
        <BeadCanvas size={280} />
      </div>

      {/* 珠串样式选择 */}
      <div className="w-full px-4 mt-4">
        <div className="text-xs font-serif-sc text-center mb-3 opacity-60" style={{ color: '#C9A84C' }}>
          珠串样式
        </div>
        <div className="flex gap-2">
          {BEAD_STYLES.map(bead => {
            const isUnlocked = state.merit >= bead.unlockMerit || state.isPremium;
            const isSelected = state.selectedBead === bead.id;

            return (
              <button
                key={bead.id}
                onClick={() => isUnlocked && selectBead(bead.id)}
                className="flex-1 p-2 rounded-xl transition-all"
                style={{
                  background: isSelected ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-1"
                  style={{ background: bead.color }}
                />
                <div className="text-xs font-serif-sc text-center" style={{ color: isSelected ? '#FFD700' : '#888' }}>
                  {bead.name}
                </div>
                {!isUnlocked && (
                  <div className="text-xs text-center opacity-50" style={{ color: '#C9A84C' }}>
                    {formatMerit(bead.unlockMerit)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 修行提示 */}
      <div className="mt-4 px-4 text-center">
        <p className="text-xs font-serif-sc italic opacity-50" style={{ color: '#E8DCC8' }}>
          「{levelInfo.verse}」
        </p>
      </div>
    </div>
  );
}
