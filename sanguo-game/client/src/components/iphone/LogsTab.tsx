/**
 * 史官日志 — 数据可视化与历史复盘
 */

import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { PRESTIGE_LEVELS } from '@/lib/gameStore';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2" style={{ background: 'oklch(0.18 0.012 270)', border: '1px solid oklch(0.8 0.15 90 / 0.3)' }}>
        <p className="text-xs text-[oklch(0.6_0.005_90)]">{label}</p>
        <p className="font-nunito text-sm font-bold text-[oklch(0.8_0.15_90)]">{payload[0].value} 国力</p>
      </div>
    );
  }
  return null;
};

export default function LogsTab() {
  const { state } = useGame();

  const prestige = PRESTIGE_LEVELS[state.prestigeLevel];
  const weeklyAvg = Math.floor(state.dailyLogs.reduce((s, l) => s + l.power, 0) / state.dailyLogs.length);

  const chartData = state.dailyLogs.map(log => ({
    date: log.date.slice(5),
    power: log.power,
    steps: Math.floor(log.steps / 100),
  })).reverse();

  const loyaltyData = [
    { day: '周一', guanyu: 95, zhugeliang: 100, caocao: 88, diaochan: 72 },
    { day: '周二', guanyu: 93, zhugeliang: 100, caocao: 86, diaochan: 70 },
    { day: '周三', guanyu: 94, zhugeliang: 99, caocao: 87, diaochan: 68 },
    { day: '周四', guanyu: 96, zhugeliang: 100, caocao: 89, diaochan: 73 },
    { day: '周五', guanyu: 95, zhugeliang: 100, caocao: 88, diaochan: 72 },
    { day: '周六', guanyu: 97, zhugeliang: 100, caocao: 90, diaochan: 75 },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif-sc text-xl font-bold text-[oklch(0.95_0.005_90)]">史官日志</h2>
          <span className="text-xs text-[oklch(0.5_0.005_90)]">天下总览</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '统一天下进度', value: `${state.unifiedProgress}%`, icon: '🌏', color: 'oklch(0.8 0.15 90)' },
            { label: '已完成战役', value: `${state.completedCampaigns.length} / 8`, icon: '⚔️', color: 'oklch(0.45 0.1 140)' },
            { label: '连续治国天数', value: `${state.consecutiveDays} 天`, icon: '📅', color: 'oklch(0.55 0.12 200)' },
            { label: '当前声望等级', value: prestige.name, icon: '👑', color: 'oklch(0.65 0.12 90)' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="iron-card rounded-xl p-3"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="font-nunito text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[oklch(0.45_0.005_90)] text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Prestige Timeline */}
        <div className="iron-card rounded-xl p-4">
          <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)] mb-4">声望晋升路径</h3>
          <div className="space-y-2">
            {PRESTIGE_LEVELS.map((level, i) => {
              const isCurrent = i === state.prestigeLevel;
              const isPast = i < state.prestigeLevel;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{
                      background: isCurrent ? 'oklch(0.8 0.15 90)' : isPast ? 'oklch(0.45 0.1 140)' : 'oklch(1 0 0 / 0.08)',
                      color: isCurrent ? 'oklch(0.1 0.008 270)' : isPast ? 'white' : 'oklch(0.4 0.005 270)',
                    }}
                  >
                    {isPast ? '✓' : isCurrent ? '★' : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-serif-sc text-sm"
                        style={{ color: isCurrent ? 'oklch(0.8 0.15 90)' : isPast ? 'oklch(0.6 0.005 90)' : 'oklch(0.4 0.005 270)' }}
                      >
                        {level.name}
                      </span>
                      <span className="font-nunito text-xs text-[oklch(0.4_0.005_90)]">
                        {level.max === Infinity ? `${level.min.toLocaleString()}+` : `${level.min.toLocaleString()}–${level.max.toLocaleString()}`}
                      </span>
                    </div>
                    {isCurrent && (
                      <p className="text-xs text-[oklch(0.45_0.1_140)] mt-0.5">{level.privilege}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Power Chart */}
        <div className="iron-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)]">本周国力趋势</h3>
            <span className="font-nunito text-xs text-[oklch(0.5_0.005_90)]">周均 {weeklyAvg}</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: 'oklch(0.45 0.005 270)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.45 0.005 270)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="power" fill="oklch(0.8 0.15 90)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loyalty Chart */}
        <div className="iron-card rounded-xl p-4">
          <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)] mb-4">武将忠诚度趋势</h3>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={loyaltyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="guanyuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.2 20)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.2 20)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="zhugliangGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.12 200)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.12 200)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'oklch(0.45 0.005 270)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 105]} tick={{ fill: 'oklch(0.45 0.005 270)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'oklch(0.18 0.012 270)', border: '1px solid oklch(0.8 0.15 90 / 0.3)', borderRadius: '8px', color: 'oklch(0.95 0.005 90)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="guanyu" stroke="oklch(0.6 0.2 20)" fill="url(#guanyuGrad)" strokeWidth={2} name="关羽" />
              <Area type="monotone" dataKey="zhugeliang" stroke="oklch(0.55 0.12 200)" fill="url(#zhugliangGrad)" strokeWidth={2} name="诸葛亮" />
              <Line type="monotone" dataKey="caocao" stroke="oklch(0.8 0.15 90)" strokeWidth={2} dot={false} name="曹操" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[
              { name: '关羽', color: 'oklch(0.6 0.2 20)' },
              { name: '诸葛亮', color: 'oklch(0.55 0.12 200)' },
              { name: '曹操', color: 'oklch(0.8 0.15 90)' },
            ].map((w, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: w.color }} />
                <span className="text-xs text-[oklch(0.5_0.005_90)]">{w.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Log Timeline */}
        <div className="iron-card rounded-xl p-4">
          <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)] mb-4">九州足迹</h3>
          <div className="space-y-4">
            {state.dailyLogs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                    style={{ background: i === 0 ? 'oklch(0.8 0.15 90)' : 'oklch(0.3 0.005 270)' }}
                  />
                  {i < state.dailyLogs.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: 'oklch(1 0 0 / 0.08)' }} />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-nunito text-xs text-[oklch(0.5_0.005_90)]">{log.date}</span>
                    <div className="flex gap-2">
                      <span className="font-nunito text-xs text-[oklch(0.8_0.15_90)]">+{log.power} 国力</span>
                      <span className="font-nunito text-xs text-[oklch(0.45_0.1_140)]">+{log.mileage} 里</span>
                    </div>
                  </div>
                  <p className="text-xs text-[oklch(0.65_0.005_90)] mb-1">{log.event}</p>
                  {log.campaign && (
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'oklch(0.45 0.1 140 / 0.15)', color: 'oklch(0.45 0.1 140)' }}
                    >
                      ⚔️ {log.campaign}
                    </span>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-[oklch(0.4_0.005_90)]">
                    <span>👣 {log.steps.toLocaleString()} 步</span>
                    <span>❤️ {log.heartRate} bpm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription CTA */}
        <div className="gold-border-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-serif-sc text-sm font-bold text-[oklch(0.8_0.15_90)]">月度军报</h3>
              <p className="text-xs text-[oklch(0.5_0.005_90)]">¥30/月 · 深度策略分析报告</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs text-[oklch(0.6_0.005_90)] mb-3">
            {['每日额外军粮 ×1', '专属订阅者表盘皮肤「天下归一盘」', '解锁「乱世月报」深度分析'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[oklch(0.8_0.15_90)]">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[oklch(0.4_0.005_90)] text-center">只卖外观，不卖数值 · 公平策略承诺</p>
        </div>
      </div>
    </div>
  );
}
