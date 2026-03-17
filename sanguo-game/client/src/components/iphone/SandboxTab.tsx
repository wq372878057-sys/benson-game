/**
 * 九州沙盘主界面
 * 国力数据仪表盘 + 战略推进
 */

import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { PRESTIGE_LEVELS, stepsToMileage } from '@/lib/gameStore';
import { toast } from 'sonner';

const MAP_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RFNZ6irBkA3J3x2UatnzHz/sanguo-map-bg-D8WZSAHjzY8pDkqHuriHmz.webp';

export default function SandboxTab() {
  const { state, syncData } = useGame();

  const stepPercent = Math.min((state.todaySteps / state.stepGoal) * 100, 100);
  const mileage = stepsToMileage(state.todaySteps);
  const prestige = PRESTIGE_LEVELS[state.prestigeLevel];
  const nextPrestige = PRESTIGE_LEVELS[Math.min(state.prestigeLevel + 1, PRESTIGE_LEVELS.length - 1)];
  const powerToNext = nextPrestige.min - state.nationalPower;
  const powerPercent = Math.min(
    ((state.nationalPower - prestige.min) / (prestige.max - prestige.min)) * 100,
    100
  );

  const handleSync = () => {
    syncData();
    toast.success('军情数据已同步', {
      description: '今日步数、心率、国力已更新',
      style: { background: 'oklch(0.14 0.01 270)', border: '1px solid oklch(0.8 0.15 90 / 0.3)', color: 'oklch(0.95 0.005 90)' },
    });
  };

  const currentCampaign = state.campaigns.find(c => c.id === state.currentCampaign);

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Map Area */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${MAP_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[oklch(0.08_0.008_270)]" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[oklch(0.6_0.005_90)] text-xs mb-1">当前战役</p>
              <h2 className="font-serif-sc text-xl font-bold text-[oklch(0.95_0.005_90)]">
                {currentCampaign?.name || '黄巾之乱'}
              </h2>
              <p className="text-[oklch(0.8_0.15_90)] text-sm">第 {state.currentCampaign} 战役 / 共 8 战役</p>
            </div>
            <div className="text-right">
              <p className="text-[oklch(0.6_0.005_90)] text-xs">统一进度</p>
              <p className="font-nunito text-2xl font-bold text-[oklch(0.8_0.15_90)]">{state.unifiedProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-4 mt-2">
        {/* Fatigue Warning */}
        {state.fatigueValue > 50 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg px-4 py-3 flex items-center gap-3 fatigue-blink"
            style={{ background: 'oklch(0.6 0.2 20 / 0.15)', border: '1px solid oklch(0.6 0.2 20 / 0.4)' }}
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-[oklch(0.6_0.2_20)] text-sm font-semibold">疲劳积累 {state.fatigueValue}，需休养生息</p>
              <p className="text-[oklch(0.5_0.005_90)] text-xs">完成今日步数目标可减少疲劳 -20</p>
            </div>
          </motion.div>
        )}

        {/* Today's Military Report */}
        <div className="iron-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-sc text-base font-semibold text-[oklch(0.8_0.15_90)]">今日军情</h3>
            <span className="text-xs text-[oklch(0.5_0.005_90)]">2026年3月17日</span>
          </div>

          {/* Steps Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[oklch(0.7_0.005_90)]">今日行军步数</span>
              <span className="font-nunito text-sm font-bold text-[oklch(0.8_0.15_90)]">
                {state.todaySteps.toLocaleString()} / {state.stepGoal.toLocaleString()}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[oklch(1_0_0/0.08)] overflow-hidden">
              <motion.div
                className="h-full rounded-full progress-gold"
                initial={{ width: 0 }}
                animate={{ width: `${stepPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-[oklch(0.5_0.005_90)]">已转化里程：{mileage} 里</span>
              <span className="text-xs text-[oklch(0.8_0.15_90)]">{stepPercent.toFixed(0)}%</span>
            </div>
          </div>

          {/* Power Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '民心指数', value: '78', unit: '/ 100', color: 'oklch(0.45 0.1 140)', icon: '🏘️' },
              { label: '粮草储备', value: '2,840', unit: '石', color: 'oklch(0.8 0.15 90)', icon: '🌾' },
              { label: '兵力部署', value: '15,200', unit: '人', color: 'oklch(0.6 0.2 20)', icon: '⚔️' },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg p-3 text-center" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="font-nunito text-base font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[oklch(0.5_0.005_90)] text-xs">{stat.unit}</div>
                <div className="text-[oklch(0.45_0.005_90)] text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* National Power Progress */}
        <div className="iron-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif-sc text-base font-semibold text-[oklch(0.8_0.15_90)]">声望境界</h3>
            <span className="font-serif-sc text-sm text-[oklch(0.8_0.15_90)]">{prestige.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-nunito text-2xl font-bold text-[oklch(0.8_0.15_90)]">
              {state.nationalPower.toLocaleString()}
            </span>
            <span className="text-xs text-[oklch(0.5_0.005_90)]">
              距「{nextPrestige.name}」还差 {powerToNext > 0 ? powerToNext.toLocaleString() : '已达成'} 国力
            </span>
          </div>
          <div className="h-2 rounded-full bg-[oklch(1_0_0/0.08)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, oklch(0.65 0.12 90), oklch(0.8 0.15 90))' }}
              initial={{ width: 0 }}
              animate={{ width: `${powerPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-[oklch(0.4_0.005_90)]">
            <span>{prestige.min.toLocaleString()}</span>
            <span>{prestige.max === Infinity ? '∞' : prestige.max.toLocaleString()}</span>
          </div>
        </div>

        {/* Strategic Mileage */}
        <div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: 'oklch(0.14 0.01 270)', border: '1px solid oklch(0.8 0.15 90 / 0.15)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif-sc text-base font-semibold text-[oklch(0.8_0.15_90)]">战略里程</h3>
              <span className="text-xs text-[oklch(0.5_0.005_90)]">第 {state.currentCampaign} 战役进行中</span>
            </div>
            <div className="font-nunito text-3xl font-bold text-[oklch(0.8_0.15_90)] mb-1">
              {(mileage + 1240).toLocaleString()} <span className="text-lg text-[oklch(0.6_0.005_90)]">里</span>
            </div>
            <p className="text-[oklch(0.5_0.005_90)] text-xs">距下一战略目标还需 {Math.max(0, 500 - mileage)} 里</p>
            <div className="mt-3 h-1.5 rounded-full bg-[oklch(1_0_0/0.08)] overflow-hidden">
              <motion.div
                className="h-full rounded-full progress-bronze"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((mileage / 500) * 100, 100)}%` }}
                transition={{ duration: 1.2 }}
              />
            </div>
          </div>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleSync}
          className="w-full py-4 rounded-xl font-serif-sc text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, oklch(0.65 0.12 90), oklch(0.8 0.15 90))',
            color: 'oklch(0.1 0.008 270)',
            boxShadow: '0 4px 20px oklch(0.8 0.15 90 / 0.3)',
          }}
        >
          ⚡ 同步军情数据
        </button>

        {/* Watch Entry */}
        <div
          className="rounded-xl p-4 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'oklch(0.12 0.01 270)', border: '1px solid oklch(0.45 0.1 140 / 0.3)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌚</span>
            <div>
              <p className="font-serif-sc text-sm font-semibold text-[oklch(0.45_0.1_140)]">Apple Watch 军情速报</p>
              <p className="text-xs text-[oklch(0.4_0.005_90)]">watchOS 9.0+ · 独立运行</p>
            </div>
          </div>
          <span className="text-[oklch(0.45_0.1_140)]">→</span>
        </div>
      </div>
    </div>
  );
}
