/**
 * iPhone端 - 替天行道日志
 * Design: 水墨江湖·沉浸叙事
 */

import { useGame } from '@/contexts/GameContext';
import { LOYALTY_LEVELS, calculateSleepScore } from '@/lib/gameData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, CartesianGrid,
} from 'recharts';

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '今日'];

export default function JournalScreen() {
  const { state } = useGame();
  const { loyaltyValue, loyaltyLevel, consecutiveDays, totalMiles, weeklySteps, loyaltyHistory, journalEntries, battles } = state;

  const completedBattles = battles.filter(b => b.status === 'completed').length;

  const weeklyData = weeklySteps.map((steps, i) => ({
    day: DAYS[i],
    steps,
    goal: 10000,
  }));

  const loyaltyData = loyaltyHistory.map((val, i) => ({
    day: `第${i + 1}天`,
    loyalty: val,
  }));

  const currentLevelInfo = LOYALTY_LEVELS.find(l => l.level === loyaltyLevel)!;
  const nextLevelInfo = LOYALTY_LEVELS[LOYALTY_LEVELS.indexOf(currentLevelInfo) + 1];
  const levelProgress = nextLevelInfo
    ? ((loyaltyValue - currentLevelInfo.min) / (nextLevelInfo.min - currentLevelInfo.min)) * 100
    : 100;

  const sleepScore = calculateSleepScore(state.dailyHealth.sleepHours, state.dailyHealth.sleepDeepHours);

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* 聚义总览 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ink-card p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{totalMiles.toLocaleString()}</div>
          <div className="text-xs text-white/40 mt-0.5">江湖总里程</div>
        </div>
        <div className="ink-card p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{completedBattles} / 36</div>
          <div className="text-xs text-white/40 mt-0.5">已历战役</div>
        </div>
        <div className="ink-card p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{consecutiveDays}</div>
          <div className="text-xs text-white/40 mt-0.5">连续习武天数</div>
        </div>
        <div className="ink-card p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{loyaltyLevel}</div>
          <div className="text-xs text-white/40 mt-0.5">当前忠义境界</div>
        </div>
      </div>

      {/* 忠义境界进度 */}
      <div className="ink-card p-4">
        <h3 className="text-sm font-semibold gold-text mb-3" style={{ fontFamily: 'Noto Serif SC, serif' }}>忠义境界</h3>
        <div className="space-y-2">
          {LOYALTY_LEVELS.map((level, i) => {
            const isActive = level.level === loyaltyLevel;
            const isPassed = LOYALTY_LEVELS.indexOf(currentLevelInfo) > i;
            return (
              <div key={level.level} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isActive ? 'bg-amber-400/10 border border-amber-400/30' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  isPassed ? 'bg-green-500 text-white' : isActive ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/30'
                }`}>
                  {isPassed ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${isActive ? 'text-amber-400' : isPassed ? 'text-white/60' : 'text-white/30'}`}>
                    {level.level}
                  </div>
                  <div className="text-xs text-white/30">{level.min.toLocaleString()} – {level.max === Infinity ? '∞' : level.max.toLocaleString()} 忠义</div>
                </div>
                {isActive && (
                  <div className="text-xs text-amber-400">当前</div>
                )}
              </div>
            );
          })}
        </div>
        
        {nextLevelInfo && (
          <div className="mt-3 pt-3 border-t border-white/8">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>距「{nextLevelInfo.level}」</span>
              <span>{(nextLevelInfo.min - loyaltyValue).toLocaleString()} 忠义</span>
            </div>
            <div className="ink-progress h-2">
              <div className="ink-progress-bar" style={{ width: `${levelProgress}%`, background: 'linear-gradient(90deg, #F39C12, #E67E22)' }} />
            </div>
          </div>
        )}
      </div>

      {/* 本周步数柱状图 */}
      <div className="ink-card p-4">
        <h3 className="text-sm font-semibold gold-text mb-3" style={{ fontFamily: 'Noto Serif SC, serif' }}>本周步数</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
            <Tooltip
              contentStyle={{ background: 'oklch(0.16 0.006 285)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
              formatter={(v: number) => [v.toLocaleString() + ' 步', '步数']}
            />
            <Bar dataKey="steps" fill="oklch(0.45 0.22 22)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="goal" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-xs text-white/40 text-center mt-1">
          周均 {Math.round(weeklySteps.filter(s => s > 0).reduce((a, b) => a + b, 0) / weeklySteps.filter(s => s > 0).length).toLocaleString()} 步
        </div>
      </div>

      {/* 忠义值趋势 */}
      <div className="ink-card p-4">
        <h3 className="text-sm font-semibold gold-text mb-3" style={{ fontFamily: 'Noto Serif SC, serif' }}>忠义值趋势</h3>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={loyaltyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="loyaltyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.22 22)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.45 0.22 22)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
            <Tooltip
              contentStyle={{ background: 'oklch(0.16 0.006 285)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
              formatter={(v: number) => [v.toLocaleString(), '忠义值']}
            />
            <Area type="monotone" dataKey="loyalty" stroke="oklch(0.55 0.22 22)" fill="url(#loyaltyGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 江湖足迹时间线 */}
      <div className="ink-card p-4">
        <h3 className="text-sm font-semibold gold-text mb-3" style={{ fontFamily: 'Noto Serif SC, serif' }}>江湖足迹</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-4">
            {journalEntries.map((entry, i) => (
              <div key={i} className="flex gap-4 pl-8 relative">
                <div className="absolute left-3 top-1 w-2.5 h-2.5 rounded-full bg-red-700 border-2 border-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/40">{entry.date}</span>
                    <span className="text-xs text-amber-400">+{entry.loyaltyGained} 忠义</span>
                    <span className="text-xs text-blue-400">+{entry.milesGained} 里</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{entry.event}</p>
                  {entry.battleCompleted && (
                    <div className="mt-1 text-xs text-green-400">✓ 通关：{entry.battleCompleted}</div>
                  )}
                  <div className="mt-1 text-xs text-white/30">心境：{entry.mood}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 月度礼包 */}
      <div className="ink-card p-4 border border-amber-400/20">
        <div className="flex items-start gap-3">
          <div className="text-3xl">👑</div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-400 mb-1" style={{ fontFamily: 'Noto Serif SC, serif' }}>梁山聚义令</h3>
            <div className="text-xs text-white/60 mb-2">月度订阅 ¥30/月</div>
            <div className="space-y-1 text-xs text-white/50">
              <div>✓ 解锁全部好汉传记与背景故事</div>
              <div>✓ 每日额外获得 20% 忠义值加成</div>
              <div>✓ 专属梁山聚义厅背景皮肤</div>
              <div>✓ 优先体验新战役与新好汉</div>
            </div>
          </div>
        </div>
        <button className="hero-btn w-full py-3 rounded-xl font-semibold text-sm mt-3">
          立即订阅
        </button>
        <p className="text-xs text-white/30 text-center mt-2">只卖外观，不卖数值 · 公平游戏承诺</p>
      </div>
    </div>
  );
}
