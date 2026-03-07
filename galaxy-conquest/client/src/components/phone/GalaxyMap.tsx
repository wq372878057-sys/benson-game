// ============================================================
// 手机端 - 星图主界面
// 设计：星云漂流者 | 宇宙有机主义
// ============================================================
import { useGame } from '../../contexts/GameContext';
import { DAILY_STEP_GOAL } from '../../lib/gameEngine';
import RingProgress from '../RingProgress';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/iKaSztYxMR5QQWpWwMaqXe/lightsaber-hero_0a362984.png';

export default function GalaxyMap() {
  const { state, syncData } = useGame();
  const { today, force, galaxy } = state;

  const stepProgress = today.steps / DAILY_STEP_GOAL;
  const stageProgress = galaxy.currentLightYears / galaxy.stageGoalLightYears;
  const sleepScore = Math.round(Math.min(today.sleepHours / 8, 1) * 60 + Math.min(today.sleepDeepHours / 2, 1) * 40);

  const currentMission = state.missions.find(m => m.id === galaxy.currentMission);

  return (
    <div className="h-full overflow-y-auto pb-20 scrollbar-none">
      {/* Hero Banner */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={HERO_BG}
          alt="银河征服者"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-[oklch(0.06_0.015_240)]" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-orbitron text-glow-blue uppercase tracking-widest mb-1">
                {galaxy.currentSector}
              </p>
              <h2 className="text-white font-orbitron font-bold text-lg leading-tight drop-shadow-lg">
                {currentMission?.name || '银河征服者'}
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                第 {galaxy.currentMission} 关 · {currentMission?.location}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 font-mono-tech">总航行</p>
              <p className="text-glow-gold font-orbitron font-bold text-xl">
                {galaxy.totalLightYears.toLocaleString()}
              </p>
              <p className="text-white/50 text-xs">光年</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 pt-2">
        {/* 今日训练卡片 */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-orbitron text-sm font-semibold text-glow-blue">今日训练</h3>
            <button
              onClick={syncData}
              className="text-xs glass-card-blue px-3 py-1 rounded-full text-blue-300 hover:text-blue-200 transition-colors active:scale-95"
            >
              同步数据
            </button>
          </div>

          <div className="flex items-center gap-4">
            <RingProgress
              progress={stepProgress}
              size={90}
              strokeWidth={8}
              color="oklch(0.65 0.22 240)"
            >
              <div className="text-center">
                <p className="font-mono-tech text-white font-bold text-base leading-none">
                  {(today.steps / 1000).toFixed(1)}k
                </p>
                <p className="text-white/50 text-[9px] mt-0.5">步数</p>
              </div>
            </RingProgress>

            <div className="flex-1 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">已航行</span>
                  <span className="font-mono-tech text-glow-blue">{today.lightYears} 光年</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full force-bar rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(stepProgress * 100, 100)}%` }}
                  />
                </div>
                <p className="text-white/40 text-[10px] mt-0.5 text-right">
                  目标 {(DAILY_STEP_GOAL / 1000).toFixed(0)}k 步
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">阶段进度</span>
                  <span className="font-mono-tech text-glow-gold">
                    {galaxy.currentLightYears}/{galaxy.stageGoalLightYears} 光年
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(stageProgress * 100, 100)}%`,
                      background: 'linear-gradient(90deg, oklch(0.78 0.18 85), oklch(0.88 0.16 85))',
                      boxShadow: '0 0 8px oklch(0.78 0.18 85 / 0.5)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 三项健康指标 */}
        <div className="grid grid-cols-3 gap-2">
          {/* 心率 */}
          <div className="glass-card rounded-xl p-3 text-center">
            <div className="text-xl mb-1">❤️</div>
            <p className="font-mono-tech text-glow-red font-bold text-lg leading-none">
              {today.heartRateAvg}
            </p>
            <p className="text-white/40 text-[10px] mt-1">平均心率</p>
            <p className="text-white/30 text-[9px]">bpm</p>
          </div>

          {/* 睡眠 */}
          <div className="glass-card rounded-xl p-3 text-center">
            <div className="text-xl mb-1">🌙</div>
            <p className="font-mono-tech text-glow-blue font-bold text-lg leading-none">
              {sleepScore}
            </p>
            <p className="text-white/40 text-[10px] mt-1">睡眠质量</p>
            <p className="text-white/30 text-[9px]">{today.sleepHours.toFixed(1)}h</p>
          </div>

          {/* 卡路里 */}
          <div className="glass-card rounded-xl p-3 text-center">
            <div className="text-xl mb-1">🔥</div>
            <p className="font-mono-tech text-glow-gold font-bold text-lg leading-none">
              {today.caloriesBurned.toLocaleString()}
            </p>
            <p className="text-white/40 text-[10px] mt-1">消耗卡路里</p>
            <p className="text-white/30 text-[9px]">{today.activeMinutes}min</p>
          </div>
        </div>

        {/* 原力状态 */}
        <div className={`rounded-2xl p-4 ${force.darkSideWarning ? 'glass-card-red' : 'glass-card-blue'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-orbitron text-sm font-semibold text-white">原力状态</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-orbitron ${
              force.forceAlignment === 'light' ? 'bg-blue-500/20 text-blue-300' :
              force.forceAlignment === 'dark' ? 'bg-red-500/20 text-red-300' :
              'bg-white/10 text-white/60'
            }`}>
              Lv.{force.forceLevel} {force.forceLevelName}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-300/80">光明原力</span>
                <span className="font-mono-tech text-glow-blue">{force.lightSidePoints.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full force-bar rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((force.lightSidePoints / 80000) * 100, 100)}%` }}
                />
              </div>
            </div>

            {force.darkSidePoints > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-300/80">黑暗侵蚀</span>
                  <span className="font-mono-tech text-glow-red">{force.darkSidePoints}/100</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full dark-bar rounded-full transition-all duration-700"
                    style={{ width: `${force.darkSidePoints}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {force.darkSideWarning && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-300 bg-red-500/10 rounded-lg px-3 py-2">
              <span className="animate-pulse-glow">⚠️</span>
              <span>黑暗面侵蚀 {force.darkSidePoints}，需通过训练净化！</span>
            </div>
          )}
        </div>

        {/* 当前任务简报 */}
        {currentMission && (
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-orbitron text-glow-gold uppercase tracking-wider">当前任务</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <h4 className="text-white font-semibold mb-1">{currentMission.name}</h4>
            <p className="text-white/50 text-xs leading-relaxed mb-3">{currentMission.narrative}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-[10px]">解锁条件</p>
                <p className="text-white/70 text-xs">{currentMission.unlockCondition}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[10px]">进度</p>
                <p className="font-mono-tech text-glow-blue text-sm">
                  {currentMission.unlockProgress}/{currentMission.unlockTarget}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 连续训练 */}
        <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-xs">连续训练</p>
            <p className="font-orbitron font-bold text-2xl text-glow-gold">{force.consecutiveDays} 天</p>
            <p className="text-white/40 text-xs mt-0.5">
              {force.consecutiveDays >= 7 ? '🏆 坚韧武士称号激活' : `再坚持 ${7 - force.consecutiveDays} 天解锁称号`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-[10px]">今日原力</p>
            <p className="font-mono-tech text-glow-blue font-bold text-lg">+{today.forceGained}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
