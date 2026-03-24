/**
 * iPhone端 - 聚义厅主界面
 * Design: 水墨江湖·沉浸叙事 - 深色水墨底色 + 英雄红 + 金黄高光
 */

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { calculateSleepScore, getHeartRateZone } from '@/lib/gameData';
import { toast } from 'sonner';

const HERO_BANNER = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RUixAFWpWkwbNMtYmRxaaK/hero-banner-ZEkhA7PFcZuR8z2zqWU2Ub.webp';

export default function HomeScreen() {
  const { state, syncHealth } = useGame();
  const { dailyHealth, loyaltyValue, evilValue, totalMiles, consecutiveDays, currentBattle } = state;
  const [syncing, setSyncing] = useState(false);

  const stepsPercent = Math.min((dailyHealth.steps / dailyHealth.stepGoal) * 100, 100);
  const sleepScore = calculateSleepScore(dailyHealth.sleepHours, dailyHealth.sleepDeepHours);
  const hrZone = getHeartRateZone(dailyHealth.heartRateAvg);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    // Simulate slightly updated data
    syncHealth(
      dailyHealth.steps + Math.floor(Math.random() * 500),
      dailyHealth.heartRateAvg + Math.floor(Math.random() * 5 - 2),
      dailyHealth.sleepHours,
      dailyHealth.sleepDeepHours,
      dailyHealth.caloriesBurned + Math.floor(Math.random() * 30),
      dailyHealth.activeMinutes + Math.floor(Math.random() * 5),
    );
    setSyncing(false);
    toast.success('数据同步成功', { description: '今日功课已更新，忠义值已结算' });
  };

  const currentBattleInfo = state.battles.find(b => b.id === currentBattle);

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* 英雄区 - 梁山场景图 */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 180 }}>
        <img src={HERO_BANNER} alt="梁山风云录" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* 恶念警示 */}
        {evilValue > 30 && (
          <div className="absolute top-3 left-3 right-3 flex items-center gap-2 bg-purple-900/80 border border-purple-500/50 rounded-lg px-3 py-2">
            <span className="text-sm">⚠️</span>
            <span className="text-xs text-purple-200">恶念积累 {evilValue}，需习武克服</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-amber-400/80 mb-1">当前战役</p>
              <h2 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                {currentBattleInfo?.name || '梁山聚义'}
              </h2>
              <p className="text-xs text-white/60 mt-0.5">{currentBattleInfo?.location} · 第 {currentBattle} 战 / 共三十六战</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">{loyaltyValue.toLocaleString()}</div>
              <div className="text-xs text-white/60">忠义值</div>
            </div>
          </div>
        </div>
      </div>

      {/* 今日功课卡片 */}
      <div className="ink-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold gold-text" style={{ fontFamily: 'Noto Serif SC, serif' }}>今日功课</h3>
          <span className="text-xs text-white/40">{dailyHealth.date}</span>
        </div>
        
        {/* 步数进度 */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base">👣</span>
              <span className="text-sm text-white/80">今日步数</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white">{dailyHealth.steps.toLocaleString()}</span>
              <span className="text-xs text-white/40"> / {dailyHealth.stepGoal.toLocaleString()}</span>
            </div>
          </div>
          <div className="ink-progress h-2">
            <div className="ink-progress-bar" style={{ width: `${stepsPercent}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/40">已转化 {Math.floor(dailyHealth.steps / 100)} 里程</span>
            <span className="text-xs text-amber-400">{stepsPercent.toFixed(0)}%</span>
          </div>
        </div>

        {/* 三项健康指标 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-lg mb-0.5">❤️</div>
            <div className="text-sm font-bold" style={{ color: hrZone.color }}>{dailyHealth.heartRateAvg}</div>
            <div className="text-xs text-white/40">bpm</div>
            <div className="text-xs mt-0.5" style={{ color: hrZone.color }}>{hrZone.zone}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-lg mb-0.5">🌙</div>
            <div className="text-sm font-bold text-blue-300">{dailyHealth.sleepHours.toFixed(1)}h</div>
            <div className="text-xs text-white/40">睡眠</div>
            <div className="text-xs text-blue-400 mt-0.5">评分 {sleepScore}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="text-lg mb-0.5">🔥</div>
            <div className="text-sm font-bold text-orange-300">{dailyHealth.caloriesBurned}</div>
            <div className="text-xs text-white/40">千卡</div>
            <div className="text-xs text-orange-400 mt-0.5">{dailyHealth.activeMinutes}分钟</div>
          </div>
        </div>
      </div>

      {/* 江湖里程卡片 */}
      <div className="ink-card p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={HERO_BANNER} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold gold-text" style={{ fontFamily: 'Noto Serif SC, serif' }}>江湖里程</h3>
            <span className="text-xs text-white/40">连续习武 {consecutiveDays} 天</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-amber-400">{totalMiles.toLocaleString()}</span>
            <span className="text-sm text-white/40 mb-1">里</span>
          </div>
          <div className="ink-progress h-1.5 mb-1">
            <div className="ink-progress-bar" style={{ width: `${(totalMiles % 500) / 500 * 100}%`, background: 'linear-gradient(90deg, #F39C12, #E67E22)' }} />
          </div>
          <p className="text-xs text-white/40">距下一阶段还需 {500 - (totalMiles % 500)} 里程</p>
        </div>
      </div>

      {/* 同步按钮 */}
      <button
        onClick={handleSync}
        disabled={syncing}
        className="hero-btn w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
      >
        {syncing ? (
          <>
            <span className="animate-spin">⚙️</span>
            <span>正在同步运动数据...</span>
          </>
        ) : (
          <>
            <span>🔄</span>
            <span>同步运动数据</span>
          </>
        )}
      </button>

      {/* Apple Watch 入口 */}
      <div className="ink-card p-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-xl border border-white/10">⌚</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Apple Watch 习武场</div>
            <div className="text-xs text-white/40">watchOS 9.0+ · 独立运行</div>
          </div>
          <div className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">已连接</div>
        </div>
      </div>

      {/* 忠义与恶念状态 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ink-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">⚖️</span>
            <span className="text-xs text-white/60">忠义境界</span>
          </div>
          <div className="text-sm font-bold text-amber-400">{state.loyaltyLevel}</div>
          <div className="text-xs text-white/40 mt-1">{loyaltyValue.toLocaleString()} 忠义</div>
        </div>
        <div className={`ink-card p-3 ${evilValue > 50 ? 'evil-glow' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🌑</span>
            <span className="text-xs text-white/60">恶念值</span>
          </div>
          <div className={`text-sm font-bold ${evilValue > 50 ? 'text-purple-400' : evilValue > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
            {evilValue} / 100
          </div>
          <div className="ink-progress h-1 mt-2">
            <div style={{ 
              width: `${evilValue}%`, 
              height: '100%', 
              borderRadius: '9999px',
              background: evilValue > 50 ? 'linear-gradient(90deg, #8E44AD, #6C3483)' : evilValue > 30 ? 'linear-gradient(90deg, #F39C12, #E67E22)' : 'linear-gradient(90deg, #27AE60, #2ECC71)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
