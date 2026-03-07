// ============================================================
// 主页面 - 星球大战：银河征服者
// Design: 星云漂流者 (Nebula Drifter) - 宇宙有机主义
// Layout: 左侧手机端 + 右侧手表端 + 中间信息面板
// ============================================================
import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '../contexts/GameContext';
import PhoneApp from '../components/PhoneApp';
import WatchApp from '../components/WatchApp';
import StarField from '../components/StarField';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/iKaSztYxMR5QQWpWwMaqXe/hero-galaxy_4bbfea04.png';
const GALAXY_MAP_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/iKaSztYxMR5QQWpWwMaqXe/galaxy-map_184c3f1b.png';

// 战斗弹窗（全局）
function BattleOverlay() {
  const { state, attack, endBattle } = useGame();
  const { battle } = state;

  if (!battle.active) return null;

  const bossHpPct = battle.bossHp / battle.bossMaxHp;
  const playerHpPct = battle.playerHp / battle.playerMaxHp;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm mx-4 glass-card rounded-3xl p-6 border border-red-500/20">
        {/* 标题 */}
        <div className="text-center mb-6">
          <p className="font-orbitron text-xs text-red-300/60 uppercase tracking-widest mb-1">⚔️ 光剑对决</p>
          <h2 className="font-orbitron font-bold text-white text-xl">{battle.bossName}</h2>
        </div>

        {/* BOSS血条 */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-300">BOSS</span>
            <span className="font-mono-tech text-red-300">{battle.bossHp}/{battle.bossMaxHp}</span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full dark-bar rounded-full transition-all duration-500"
              style={{ width: `${bossHpPct * 100}%` }}
            />
          </div>
        </div>

        {/* 战斗日志 */}
        <div className="glass-card rounded-xl p-3 mb-4 min-h-[80px]">
          {battle.log.slice(0, 4).map((log, i) => (
            <p key={i} className={`text-xs leading-relaxed ${i === 0 ? 'text-white/80' : 'text-white/30'}`}>{log}</p>
          ))}
        </div>

        {/* 玩家血条 */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-300">你 · 攻击倍率 ×{battle.attackMultiplier.toFixed(1)}</span>
            <span className="font-mono-tech text-blue-300">{battle.playerHp}/{battle.playerMaxHp}</span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full force-bar rounded-full transition-all duration-500"
              style={{ width: `${playerHpPct * 100}%` }}
            />
          </div>
        </div>

        {/* 操作按钮 */}
        {battle.result ? (
          <div className="text-center">
            <p className={`font-orbitron font-bold text-2xl mb-3 ${battle.result === 'victory' ? 'text-glow-gold' : 'text-glow-red'}`}>
              {battle.result === 'victory' ? '🏆 胜利！+50 原力' : '💀 败北，再接再厉'}
            </p>
            <button
              onClick={endBattle}
              className="w-full py-3 rounded-xl glass-card text-white/70 font-semibold hover:glass-card-blue transition-all active:scale-95"
            >
              返回
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={attack}
              className="flex-1 py-3 rounded-xl glow-blue bg-blue-500/20 border border-blue-500/40 text-blue-200 font-orbitron font-bold text-sm hover:bg-blue-500/30 transition-all active:scale-95"
            >
              ⚡ 攻击
            </button>
            <button
              onClick={endBattle}
              className="px-4 py-3 rounded-xl glass-card text-white/50 text-sm hover:glass-card-red transition-all active:scale-95"
            >
              撤退
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 中间信息面板
function CenterPanel() {
  const { state, syncData } = useGame();
  const { force, galaxy, today, credits } = state;
  const [showGalaxyMap, setShowGalaxyMap] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-72 flex-shrink-0">
      {/* 游戏标题 */}
      <div className="text-center">
        <h1 className="font-orbitron font-black text-2xl text-glow-blue leading-tight">
          GALAXY
        </h1>
        <h1 className="font-orbitron font-black text-2xl text-glow-gold leading-tight">
          CONQUEST
        </h1>
        <p className="text-white/40 text-xs mt-1 font-orbitron tracking-widest">STAR WARS RPG</p>
      </div>

      {/* 核心数据卡片 */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">原力等级</span>
          <span className="font-orbitron text-glow-blue text-sm font-bold">Lv.{force.forceLevel} {force.forceLevelName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">光明原力</span>
          <span className="font-mono-tech text-glow-blue text-sm">{force.lightSidePoints.toLocaleString()}</span>
        </div>
        {force.darkSidePoints > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">黑暗侵蚀</span>
            <span className={`font-mono-tech text-sm ${force.darkSidePoints > 50 ? 'text-glow-red animate-pulse-glow' : 'text-red-400'}`}>
              {force.darkSidePoints}/100
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">银河信用点</span>
          <span className="font-mono-tech text-glow-gold text-sm">✦ {credits.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">总航行光年</span>
          <span className="font-mono-tech text-white/80 text-sm">{galaxy.totalLightYears.toLocaleString()} ly</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">连续训练</span>
          <span className="font-mono-tech text-orange-400 text-sm">🔥 {force.consecutiveDays} 天</span>
        </div>
      </div>

      {/* 今日数据 */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-orbitron text-xs text-white/60 uppercase tracking-wider">今日训练</span>
          <button
            onClick={syncData}
            className="text-[10px] glass-card-blue px-2 py-1 rounded-full text-blue-300 hover:text-blue-200 active:scale-95 transition-all"
          >
            同步
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '步数', value: today.steps.toLocaleString(), unit: '步', color: 'text-blue-300' },
            { label: '光年', value: today.lightYears.toString(), unit: 'ly', color: 'text-blue-300' },
            { label: '心率', value: today.heartRateAvg.toString(), unit: 'bpm', color: 'text-red-300' },
            { label: '卡路里', value: today.caloriesBurned.toLocaleString(), unit: 'kcal', color: 'text-orange-300' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className={`font-mono-tech font-bold text-base ${item.color}`}>{item.value}</p>
              <p className="text-white/30 text-[9px]">{item.label} · {item.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 星图按钮 */}
      <button
        onClick={() => setShowGalaxyMap(!showGalaxyMap)}
        className="glass-card rounded-2xl overflow-hidden relative group hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <img src={GALAXY_MAP_IMG} alt="星图" className="w-full h-24 object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-orbitron font-bold text-white text-sm drop-shadow-lg">🌌 银河星图</p>
        </div>
      </button>

      {/* 版本信息 */}
      <div className="text-center">
        <p className="text-white/20 text-[10px] font-orbitron">v1.0.0 · 银河征服者</p>
        <p className="text-white/15 text-[9px] mt-0.5">基于运动数据驱动的叙事RPG</p>
      </div>
    </div>
  );
}

// 主布局
function MainLayout() {
  return (
    <div className="min-h-screen starfield-bg relative overflow-hidden">
      {/* 全局星空背景 */}
      <StarField className="opacity-60" />

      {/* 背景英雄图 */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-10"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 30%)' }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航栏 */}
        <header className="flex-shrink-0 px-8 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg">⚡</div>
            <div>
              <p className="font-orbitron font-bold text-white text-sm">星球大战：银河征服者</p>
              <p className="text-white/30 text-[10px]">Star Wars: Galaxy Conquest</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="font-mono-tech">iOS 16.0+</span>
            <span className="text-white/20">|</span>
            <span className="font-mono-tech">watchOS 9.0+</span>
            <span className="text-white/20">|</span>
            <span className="font-mono-tech text-glow-blue">v1.0.0</span>
          </div>
        </header>

        {/* 设备展示区 */}
        <main className="flex-1 flex items-center justify-center px-8 py-6">
          {/* 响应式布局 */}
          <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-12 w-full max-w-6xl">
            {/* 手机端 */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <p className="font-orbitron text-xs text-white/40 uppercase tracking-widest">iPhone 端</p>
              <div className="relative">
                {/* 光晕效果 */}
                <div className="absolute -inset-4 rounded-[60px] bg-blue-500/5 blur-xl" />
                <PhoneApp />
              </div>
            </div>

            {/* 中间信息面板 */}
            <div className="flex-1 flex justify-center">
              <CenterPanel />
            </div>

            {/* 手表端 */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <p className="font-orbitron text-xs text-white/40 uppercase tracking-widest">Apple Watch 端</p>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[80px] bg-amber-500/5 blur-xl" />
                <WatchApp />
              </div>
            </div>
          </div>
        </main>

        {/* 底部说明 */}
        <footer className="flex-shrink-0 px-8 py-4 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-white/25 font-orbitron">
            {['运动驱动叙事RPG', '光明·黑暗双路线', '81关银河试炼', '原力技能树', 'Apple Watch实时战斗', '健康数据驱动'].map(tag => (
              <span key={tag} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-blue-500/40" />
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </div>

      {/* 全局战斗弹窗 */}
      <BattleOverlay />
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
}
