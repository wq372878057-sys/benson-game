// ============================================================
// Apple Watch 端 - 完整应用（五大界面）
// Design: 星云漂流者 | 宇宙有机主义
// Watch端: 深黑背景 + 圆形表盘 + 侧滑切换
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import RingProgress from './RingProgress';
import { getHeartRateZoneName, getAttackMultiplier } from '../lib/gameEngine';
import { DAILY_STEP_GOAL } from '../lib/gameEngine';

const WATCH_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/iKaSztYxMR5QQWpWwMaqXe/watch-bg_0a82ae5e.png';

type WatchTab = 'dial' | 'training' | 'battle' | 'quick' | 'stats';

const watchTabs: { id: WatchTab; icon: string; label: string }[] = [
  { id: 'dial', icon: '⌚', label: '表盘' },
  { id: 'training', icon: '🏃', label: '训练' },
  { id: 'battle', icon: '⚔️', label: '战斗' },
  { id: 'quick', icon: '⚡', label: '快捷' },
  { id: 'stats', icon: '📊', label: '统计' },
];

// ---- 表盘界面 ----
function WatchDial() {
  const { state } = useGame();
  const { today, force } = state;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });

  const stepProgress = today.steps / DAILY_STEP_GOAL;
  const forceProgress = force.lightSidePoints / 80000;
  const isDark = force.forceAlignment === 'dark';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
      {/* 背景图 */}
      <img src={WATCH_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-black/50" />

      {/* 双环进度 */}
      <div className="relative z-10 flex items-center justify-center mb-2">
        {/* 外环 - 步数 */}
        <RingProgress
          progress={stepProgress}
          size={180}
          strokeWidth={10}
          color={isDark ? 'oklch(0.58 0.26 15)' : 'oklch(0.65 0.22 240)'}
          trackColor="oklch(1 0 0 / 0.08)"
          glow={true}
        >
          {/* 内环 - 原力 */}
          <RingProgress
            progress={forceProgress}
            size={150}
            strokeWidth={8}
            color="oklch(0.78 0.18 85)"
            trackColor="oklch(1 0 0 / 0.06)"
            glow={true}
          >
            {/* 中心内容 */}
            <div className="text-center px-2">
              <p className="font-orbitron font-bold text-white text-2xl leading-none tracking-wider">
                {timeStr}
              </p>
              <p className="text-white/50 text-[9px] mt-1">{dateStr}</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-[10px]">
                <span className="font-mono-tech text-blue-300">{(today.steps / 1000).toFixed(1)}k</span>
                <span className="text-white/30">·</span>
                <span className="font-mono-tech text-red-300">{today.heartRateAvg}❤</span>
              </div>
            </div>
          </RingProgress>
        </RingProgress>
      </div>

      {/* 底部状态 */}
      <div className="relative z-10 w-full">
        {force.darkSideWarning && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1 text-center mb-1">
            <p className="text-red-300 text-[9px] animate-pulse-glow">⚠ 黑暗侵蚀 {force.darkSidePoints}，需训练净化</p>
          </div>
        )}
        <div className="flex justify-around text-center">
          <div>
            <p className="font-mono-tech text-blue-300 text-xs font-bold">{today.lightYears}</p>
            <p className="text-white/30 text-[8px]">光年</p>
          </div>
          <div>
            <p className="font-mono-tech text-amber-300 text-xs font-bold">{force.lightSidePoints.toLocaleString()}</p>
            <p className="text-white/30 text-[8px]">原力</p>
          </div>
          <div>
            <p className="font-mono-tech text-green-300 text-xs font-bold">{state.galaxy.currentMission}</p>
            <p className="text-white/30 text-[8px]">当前关</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- 训练模式 ----
function WatchTraining() {
  const { state, startTraining, stopTraining, updateHeartRate } = useGame();
  const { training } = state;

  const trainingTypes = [
    { type: 'lightsaber' as const, icon: '⚔️', name: '光剑格斗', desc: 'HIIT' },
    { type: 'endurance' as const, icon: '🏃', name: '耐力飞行', desc: '长跑' },
    { type: 'meditation' as const, icon: '🧘', name: '原力冥想', desc: '冥想' },
    { type: 'assault' as const, icon: '💪', name: '战场突袭', desc: '力量' },
  ];

  // 模拟心率变化
  useEffect(() => {
    if (!training.active) return;
    const interval = setInterval(() => {
      const targetHR = training.type === 'lightsaber' ? 165 :
        training.type === 'endurance' ? 145 :
        training.type === 'meditation' ? 85 : 155;
      const current = training.heartRate;
      const delta = (targetHR - current) * 0.1 + (Math.random() - 0.5) * 8;
      updateHeartRate(Math.max(60, Math.min(200, Math.round(current + delta))));
    }, 1500);
    return () => clearInterval(interval);
  }, [training.active, training.type, training.heartRate, updateHeartRate]);

  // 训练计时
  const { dispatch } = useGame() as { dispatch: React.Dispatch<{ type: 'TICK_TRAINING' }> };
  useEffect(() => {
    if (!training.active) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TRAINING' });
    }, 1000);
    return () => clearInterval(interval);
  }, [training.active, dispatch]);

  const zone = training.heartRateZone;
  const hrColor = zone === 'rest' ? '#e0e8ff' : zone === 'warmup' || zone === 'aerobic' ? '#4ade80' :
    zone === 'fatburn' ? '#fbbf24' : zone === 'anaerobic' ? '#f97316' : '#ef4444';

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (training.active) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-3 pt-4">
        <div className="text-center">
          <p className="text-white/50 text-[10px] font-orbitron uppercase tracking-wider">{training.typeName}</p>
          <p className="font-mono-tech text-white/60 text-sm mt-1">{formatTime(training.duration)}</p>
        </div>

        <div className="text-center">
          <p className="font-orbitron font-bold text-5xl leading-none" style={{ color: hrColor, textShadow: `0 0 20px ${hrColor}60` }}>
            {training.heartRate}
          </p>
          <p className="text-white/40 text-xs mt-1">bpm · {getHeartRateZoneName(zone)}</p>
          <p className="font-mono-tech text-amber-300/70 text-xs mt-1">
            ×{getAttackMultiplier(training.heartRate).toFixed(1)} 战斗倍率
          </p>
        </div>

        <div className="w-full">
          <div className="flex justify-around text-center mb-3">
            <div>
              <p className="font-mono-tech text-orange-300 text-sm font-bold">{training.calories.toFixed(0)}</p>
              <p className="text-white/30 text-[9px]">卡路里</p>
            </div>
            <div>
              <p className="font-mono-tech text-blue-300 text-sm font-bold">{training.lightYears.toFixed(1)}</p>
              <p className="text-white/30 text-[9px]">光年</p>
            </div>
          </div>
          <button
            onClick={stopTraining}
            className="w-full py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold active:scale-95 transition-all"
          >
            结束训练
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 pt-2">
      <p className="text-white/50 text-[10px] font-orbitron uppercase tracking-wider text-center mb-2">选择训练模式</p>
      <div className="grid grid-cols-2 gap-2">
        {trainingTypes.map(t => (
          <button
            key={t.type}
            onClick={() => startTraining(t.type)}
            className="glass-card rounded-xl p-3 text-center hover:glass-card-blue active:scale-95 transition-all"
          >
            <span className="text-2xl block mb-1">{t.icon}</span>
            <p className="text-white/80 text-[10px] font-medium">{t.name}</p>
            <p className="text-white/40 text-[9px]">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- 光剑对决 ----
function WatchBattle() {
  const { state, attack, endBattle, startBattle } = useGame();
  const { battle, training } = state;

  const currentMission = state.missions.find(m => m.id === state.galaxy.currentMission);

  if (!battle.active) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-3">
        <span className="text-4xl">⚔️</span>
        <p className="text-white/60 text-xs text-center">准备与 {currentMission?.bossName || '敌人'} 对决</p>
        <p className="text-white/40 text-[10px] text-center">当前心率: {training.heartRate} bpm</p>
        <p className="text-blue-300 text-[10px]">攻击倍率: ×{getAttackMultiplier(training.heartRate).toFixed(1)}</p>
        <button
          onClick={() => startBattle(state.galaxy.currentMission)}
          className="w-full py-2.5 rounded-xl glow-blue bg-blue-500/20 border border-blue-500/40 text-blue-200 text-sm font-semibold active:scale-95 transition-all"
        >
          ⚔️ 发起战斗
        </button>
      </div>
    );
  }

  const bossHpPct = battle.bossHp / battle.bossMaxHp;
  const playerHpPct = battle.playerHp / battle.playerMaxHp;

  return (
    <div className="w-full h-full flex flex-col p-3 gap-2">
      {/* BOSS区 */}
      <div className="glass-card-red rounded-xl p-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-red-300 text-[10px] font-semibold truncate">{battle.bossName}</p>
          <p className="font-mono-tech text-red-300 text-[10px]">{battle.bossHp}/{battle.bossMaxHp}</p>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full dark-bar rounded-full transition-all duration-500" style={{ width: `${bossHpPct * 100}%` }} />
        </div>
      </div>

      {/* 战斗日志 */}
      <div className="flex-1 overflow-hidden">
        {battle.log.slice(0, 3).map((log, i) => (
          <p key={i} className={`text-[9px] leading-relaxed ${i === 0 ? 'text-white/70' : 'text-white/30'}`}>{log}</p>
        ))}
      </div>

      {/* 玩家区 */}
      <div className="glass-card-blue rounded-xl p-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-blue-300 text-[10px]">你 · ×{battle.attackMultiplier.toFixed(1)}</p>
          <p className="font-mono-tech text-blue-300 text-[10px]">{battle.playerHp}/{battle.playerMaxHp}</p>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full force-bar rounded-full transition-all duration-500" style={{ width: `${playerHpPct * 100}%` }} />
        </div>
      </div>

      {/* 操作按钮 */}
      {battle.result ? (
        <div className="text-center">
          <p className={`text-sm font-orbitron font-bold mb-2 ${battle.result === 'victory' ? 'text-glow-gold' : 'text-glow-red'}`}>
            {battle.result === 'victory' ? '🏆 胜利！' : '💀 败北'}
          </p>
          <button onClick={endBattle} className="w-full py-2 rounded-xl glass-card text-white/70 text-xs active:scale-95">
            返回
          </button>
        </div>
      ) : (
        <button
          onClick={attack}
          className="w-full py-3 rounded-xl glow-blue bg-blue-500/20 border border-blue-500/40 text-blue-200 text-sm font-orbitron font-bold active:scale-95 transition-all"
        >
          ⚡ 攻击
        </button>
      )}
    </div>
  );
}

// ---- 快捷操作 ----
function WatchQuick() {
  const { quickAction, state } = useGame();
  const [lastAction, setLastAction] = useState<string | null>(null);

  const actions = [
    { id: 'meditate' as const, icon: '🧘', name: '冥想', desc: '光明 +20', color: 'glass-card-blue' },
    { id: 'supply' as const, icon: '🍱', name: '补给', desc: '原力 +10', color: 'glass-card' },
    { id: 'purify' as const, icon: '✨', name: '净化', desc: '黑暗 -10', color: 'glass-card-blue' },
    { id: 'remind' as const, icon: '🔔', name: '提醒', desc: '训练提醒', color: 'glass-card' },
  ];

  const handleAction = (action: typeof actions[0]) => {
    quickAction(action.id);
    setLastAction(action.name);
    setTimeout(() => setLastAction(null), 2000);
  };

  return (
    <div className="w-full h-full p-3 pt-2">
      <p className="text-white/50 text-[10px] font-orbitron uppercase tracking-wider text-center mb-3">快捷操作</p>
      {lastAction && (
        <div className="mb-2 text-center bg-green-500/20 border border-green-500/30 rounded-lg py-1">
          <p className="text-green-300 text-[10px]">✓ {lastAction} 已执行</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={`${action.color} rounded-xl p-3 text-center active:scale-95 transition-all`}
          >
            <span className="text-2xl block mb-1">{action.icon}</span>
            <p className="text-white/80 text-[10px] font-medium">{action.name}</p>
            <p className="text-white/40 text-[9px]">{action.desc}</p>
          </button>
        ))}
      </div>
      <div className="mt-2 text-center">
        <p className="text-white/30 text-[9px]">黑暗侵蚀: {state.force.darkSidePoints}/100</p>
      </div>
    </div>
  );
}

// ---- 今日统计（三环） ----
function WatchStats() {
  const { state } = useGame();
  const { today } = state;

  const stepPct = today.steps / DAILY_STEP_GOAL;
  const activePct = today.activeMinutes / 60;
  const standPct = Math.min(today.activeMinutes / 12 / 60, 1); // 模拟站立

  const rings = [
    { label: '步数环', progress: stepPct, color: 'oklch(0.65 0.22 240)', value: `${today.steps.toLocaleString()}步`, target: `/${DAILY_STEP_GOAL.toLocaleString()}` },
    { label: '活动环', progress: activePct, color: 'oklch(0.65 0.18 145)', value: `${today.activeMinutes}分钟`, target: '/60' },
    { label: '站立环', progress: standPct, color: 'oklch(0.78 0.18 85)', value: `${Math.floor(today.activeMinutes / 5)}小时`, target: '/12' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3">
      <p className="text-white/50 text-[10px] font-orbitron uppercase tracking-wider mb-3">今日三环</p>

      {/* 嵌套三环 */}
      <div className="relative flex items-center justify-center mb-3">
        <RingProgress progress={stepPct} size={170} strokeWidth={12} color="oklch(0.65 0.22 240)" glow>
          <RingProgress progress={activePct} size={136} strokeWidth={10} color="oklch(0.65 0.18 145)" glow>
            <RingProgress progress={standPct} size={104} strokeWidth={8} color="oklch(0.78 0.18 85)" glow>
              <div className="text-center">
                <p className="font-mono-tech text-white text-xs font-bold">{Math.round(stepPct * 100)}%</p>
                <p className="text-white/40 text-[8px]">完成</p>
              </div>
            </RingProgress>
          </RingProgress>
        </RingProgress>
      </div>

      {/* 图例 */}
      <div className="w-full space-y-1">
        {rings.map(ring => (
          <div key={ring.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ring.color, boxShadow: `0 0 4px ${ring.color}` }} />
            <p className="text-white/50 text-[9px] flex-1">{ring.label}</p>
            <p className="font-mono-tech text-[10px]" style={{ color: ring.color }}>{ring.value}</p>
            <p className="text-white/30 text-[9px]">{ring.target}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <p className="font-mono-tech text-amber-300 text-xs">+{state.today.forceGained} 原力今日获得</p>
      </div>
    </div>
  );
}

// ---- 主Watch组件 ----
export default function WatchApp() {
  const [activeTab, setActiveTab] = useState<WatchTab>('dial');

  return (
    <div className="watch-frame relative flex flex-col" style={{ background: '#000' }}>
      {/* 表冠 */}
      <div className="watch-crown" />

      {/* 主内容 */}
      <div className="flex-1 overflow-hidden relative" style={{ height: 'calc(100% - 36px)' }}>
        {activeTab === 'dial' && <WatchDial />}
        {activeTab === 'training' && <WatchTraining />}
        {activeTab === 'battle' && <WatchBattle />}
        {activeTab === 'quick' && <WatchQuick />}
        {activeTab === 'stats' && <WatchStats />}
      </div>

      {/* 底部导航 - 圆点指示器 */}
      <div className="flex-shrink-0 pb-2 pt-1 flex items-center justify-center gap-1.5">
        {watchTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`transition-all duration-200 ${
              activeTab === tab.id
                ? 'w-5 h-1.5 rounded-full bg-blue-400'
                : 'w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white/40'
            }`}
            title={tab.label}
          />
        ))}
      </div>
    </div>
  );
}
