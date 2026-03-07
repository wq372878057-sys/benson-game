// ============================================================
// 手机端 - 舰长日志界面
// ============================================================
import { useGame } from '../../contexts/GameContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

const FORCE_LEVELS = [
  { level: 1, name: '原力感知者', min: 0, max: 1000 },
  { level: 2, name: '学徒', min: 1001, max: 5000 },
  { level: 3, name: '武士', min: 5001, max: 15000 },
  { level: 4, name: '骑士', min: 15001, max: 30000 },
  { level: 5, name: '大师', min: 30001, max: 50000 },
  { level: 6, name: '议会成员', min: 50001, max: 80000 },
  { level: 7, name: '大绝地', min: 80001, max: 999999 },
];

export default function CaptainLog() {
  const { state } = useGame();
  const { force, galaxy, dailyData, today } = state;

  const chartData = dailyData.map(d => ({
    date: d.date.slice(5),
    steps: d.steps,
    force: d.forceGained,
    ly: d.lightYears,
  }));

  const currentLevel = FORCE_LEVELS.find(l => force.lightSidePoints >= l.min && force.lightSidePoints <= l.max) || FORCE_LEVELS[0];
  const nextLevel = FORCE_LEVELS[currentLevel.level] || null;
  const levelProgress = nextLevel
    ? (force.lightSidePoints - currentLevel.min) / (nextLevel.min - currentLevel.min)
    : 1;

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="px-4 pt-4 space-y-3">
        <h2 className="font-orbitron font-bold text-white text-base">舰长日志</h2>

        {/* 总览四格 */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '总航行光年', value: galaxy.totalLightYears.toLocaleString(), icon: '🌌', color: 'text-glow-blue' },
            { label: '已完成试炼', value: `${galaxy.completedMissions.length}/${state.missions.length}`, icon: '⚔️', color: 'text-glow-gold' },
            { label: '连续训练', value: `${force.consecutiveDays} 天`, icon: '🔥', color: 'text-orange-400' },
            { label: '原力等级', value: `Lv.${force.forceLevel}`, icon: '✨', color: 'text-glow-blue' },
          ].map(item => (
            <div key={item.label} className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <p className="text-white/50 text-[10px]">{item.label}</p>
              </div>
              <p className={`font-orbitron font-bold text-xl ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* 原力等级进度 */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-orbitron text-sm text-white font-semibold">原力倾向</h3>
            <span className="text-xs font-mono-tech text-glow-blue">{force.lightSidePoints.toLocaleString()} pt</span>
          </div>
          <div className="space-y-2">
            {FORCE_LEVELS.map(lv => (
              <div key={lv.level} className={`flex items-center gap-3 py-1.5 px-2 rounded-lg transition-all ${
                lv.level === currentLevel.level ? 'bg-blue-500/15 border border-blue-500/30' : ''
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-orbitron font-bold flex-shrink-0 ${
                  lv.level <= currentLevel.level ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-white/30'
                }`}>{lv.level}</span>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${lv.level <= currentLevel.level ? 'text-white/80' : 'text-white/30'}`}>
                    {lv.name}
                  </p>
                  {lv.level === currentLevel.level && nextLevel && (
                    <div className="mt-1">
                      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full force-bar rounded-full transition-all"
                          style={{ width: `${levelProgress * 100}%` }}
                        />
                      </div>
                      <p className="text-white/30 text-[9px] mt-0.5">
                        距下一级还需 {(nextLevel.min - force.lightSidePoints).toLocaleString()} pt
                      </p>
                    </div>
                  )}
                </div>
                {lv.level === currentLevel.level && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">当前</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 本周步数图表 */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-orbitron text-sm text-white font-semibold">本周步数</h3>
            <span className="text-xs text-white/40 font-mono-tech">
              均 {Math.round(chartData.reduce((a, b) => a + b.steps, 0) / chartData.length).toLocaleString()} 步
            </span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: 'oklch(0.55 0.04 240)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.55 0.04 240)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'oklch(0.10 0.018 240)', border: '1px solid oklch(1 0 0 / 0.1)', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: 'oklch(0.92 0.02 240)' }}
                itemStyle={{ color: 'oklch(0.65 0.22 240)' }}
              />
              <Bar dataKey="steps" fill="oklch(0.65 0.22 240)" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 原力趋势 */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-orbitron text-sm text-white font-semibold mb-3">原力获取趋势</h3>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: 'oklch(0.55 0.04 240)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.55 0.04 240)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'oklch(0.10 0.018 240)', border: '1px solid oklch(1 0 0 / 0.1)', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: 'oklch(0.92 0.02 240)' }}
              />
              <Line type="monotone" dataKey="force" stroke="oklch(0.78 0.18 85)" strokeWidth={2} dot={{ fill: 'oklch(0.78 0.18 85)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 银河航行日志 */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-orbitron text-sm text-white font-semibold mb-3">航行日志</h3>
          <div className="space-y-0">
            {[...dailyData].reverse().map((d, i) => (
              <div key={d.date} className="flex gap-3 pb-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-blue-400 glow-blue' : 'bg-white/20'}`} />
                  {i < dailyData.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-white/60 text-xs">{d.date}</p>
                    <p className="font-mono-tech text-glow-blue text-xs">+{d.forceGained} 原力</p>
                  </div>
                  <p className="text-white/40 text-[10px] mb-0.5">
                    {d.steps.toLocaleString()} 步 · {d.lightYears} 光年 · {d.caloriesBurned} kcal
                  </p>
                  <p className="text-white/30 text-[10px] italic">{d.events[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
