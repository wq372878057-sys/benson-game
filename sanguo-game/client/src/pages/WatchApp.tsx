/**
 * 三国演义：乱世英杰录 — Apple Watch 端完整模拟
 * 五大界面：军情速报表盘 · 军务处理 · 战场指挥 · 快捷指令 · 今日国力统计
 * 设计风格：深色OLED · 玄铁黑 + 帝王金 · 双环进度
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { PRESTIGE_LEVELS, getHeartRateZone, stepsToMileage } from '@/lib/gameStore';
import { toast } from 'sonner';

const WATCH_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RFNZ6irBkA3J3x2UatnzHz/sanguo-watch-bg-mjXidsFt9LfgrbsvUjvoyo.webp';

// SVG Ring Component
function Ring({ radius, strokeWidth, percent, color, bg = 'oklch(1 0 0 / 0.08)' }: {
  radius: number; strokeWidth: number; percent: number; color: string; bg?: string;
}) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <g>
      <circle cx={120} cy={120} r={radius} fill="none" stroke={bg} strokeWidth={strokeWidth} />
      <motion.circle
        cx={120} cy={120} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        transform="rotate(-90 120 120)"
      />
    </g>
  );
}

// Watch Dashboard (军情速报表盘)
function WatchDashboard({ onNavigate }: { onNavigate: (mode: string) => void }) {
  const { state } = useGame();
  const stepPercent = Math.min((state.todaySteps / state.stepGoal) * 100, 100);
  const powerPercent = Math.min((state.nationalPower / 5000) * 100, 100);
  const mileage = stepsToMileage(state.todaySteps);
  const hrZone = getHeartRateZone(state.todayHeartRate);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div className="flex flex-col items-center justify-between h-full py-3 px-2">
      {/* Brand */}
      <div className="text-center">
        <p className="font-serif-sc text-[oklch(0.8_0.15_90)] text-xs tracking-widest">乱世英杰录</p>
      </div>

      {/* Dual Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 240 240">
          {/* Outer ring - steps */}
          <Ring radius={108} strokeWidth={12} percent={stepPercent} color="oklch(0.8 0.15 90)" />
          {/* Inner ring - power */}
          <Ring radius={88} strokeWidth={10} percent={powerPercent} color="oklch(0.45 0.1 140)" />

          {/* Center content */}
          <text x="120" y="105" textAnchor="middle" fill="oklch(0.95 0.005 90)" fontSize="28" fontFamily="Nunito" fontWeight="800" letterSpacing="-1">
            {timeStr}
          </text>
          <text x="120" y="125" textAnchor="middle" fill="oklch(0.5 0.005 90)" fontSize="10" fontFamily="PingFang SC">
            {dateStr}
          </text>
          <text x="120" y="148" textAnchor="middle" fill="oklch(0.7 0.005 90)" fontSize="9" fontFamily="Nunito">
            {(mileage + 1240).toLocaleString()}里  {state.todayHeartRate}♥  第{state.currentCampaign}战役
          </text>
        </svg>

        {/* Ring Labels */}
        <div className="absolute top-1 right-1 text-right">
          <div className="font-nunito text-xs font-bold text-[oklch(0.8_0.15_90)]">{stepPercent.toFixed(0)}%</div>
          <div className="text-[oklch(0.5_0.005_90)]" style={{ fontSize: '9px' }}>行军</div>
        </div>
        <div className="absolute bottom-1 left-1">
          <div className="font-nunito text-xs font-bold text-[oklch(0.45_0.1_140)]">{powerPercent.toFixed(0)}%</div>
          <div className="text-[oklch(0.5_0.005_90)]" style={{ fontSize: '9px' }}>国力</div>
        </div>
      </div>

      {/* Fatigue Warning */}
      {state.fatigueValue > 30 && (
        <div
          className="w-full rounded-lg px-2 py-1.5 text-center fatigue-blink"
          style={{ background: 'oklch(0.6 0.2 20 / 0.2)', border: '1px solid oklch(0.6 0.2 20 / 0.4)' }}
        >
          <p className="text-[oklch(0.6_0.2_20)] font-serif-sc" style={{ fontSize: '10px' }}>
            ⚠ 疲劳积累 {state.fatigueValue}，需休养生息
          </p>
        </div>
      )}

      {/* Quick Nav */}
      <div className="flex gap-2 w-full justify-center">
        {[
          { icon: '📜', mode: 'military', label: '军务' },
          { icon: '⚔️', mode: 'battle', label: '战场' },
          { icon: '⚡', mode: 'quick', label: '指令' },
          { icon: '📊', mode: 'stats', label: '统计' },
        ].map(btn => (
          <button
            key={btn.mode}
            onClick={() => onNavigate(btn.mode)}
            className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all hover:scale-110"
            style={{ background: 'oklch(1 0 0 / 0.08)', border: '1px solid oklch(1 0 0 / 0.12)' }}
          >
            <span style={{ fontSize: '14px' }}>{btn.icon}</span>
            <span className="font-serif-sc text-[oklch(0.6_0.005_90)]" style={{ fontSize: '8px' }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Military Mode (军务处理)
function WatchMilitary({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useGame();
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hr, setHr] = useState(state.todayHeartRate);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
        setHr(h => {
          const delta = Math.floor(Math.random() * 7) - 3;
          return Math.max(55, Math.min(185, h + delta));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const hrZone = getHeartRateZone(hr);
  const mileageEarned = Math.floor(timer / 60) * 2;
  const powerEarned = Math.floor(timer / 30);

  const handleEnd = () => {
    setRunning(false);
    dispatch({ type: 'ADD_POWER', amount: powerEarned });
    toast.success('军务结算完成', { description: `获得 ${powerEarned} 国力，${mileageEarned} 里程`, style: { background: 'oklch(0.14 0.01 270)', color: 'oklch(0.95 0.005 90)' } });
    onBack();
  };

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-between h-full py-3 px-3">
      <div className="flex items-center justify-between w-full">
        <button onClick={onBack} className="text-[oklch(0.5_0.005_90)] text-xs">← 返回</button>
        <p className="font-serif-sc text-[oklch(0.8_0.15_90)] text-xs">内政巡视</p>
        <div />
      </div>

      {/* Heart Rate Display */}
      <div className="text-center">
        <div
          className="font-nunito font-black heartbeat"
          style={{ fontSize: '64px', color: hrZone.color, lineHeight: 1, textShadow: `0 0 20px ${hrZone.color}40` }}
        >
          {hr}
        </div>
        <div className="font-nunito text-sm text-[oklch(0.5_0.005_90)]">BPM</div>
        <div
          className="mt-1 px-3 py-1 rounded-full text-xs font-serif-sc"
          style={{ background: `${hrZone.color}20`, color: hrZone.color }}
        >
          {hrZone.name}
        </div>
      </div>

      {/* Timer & Stats */}
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[oklch(0.5_0.005_90)] text-xs">军务计时</span>
          <span className="font-nunito text-lg font-bold text-[oklch(0.95_0.005_90)]">{mm}:{ss}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[oklch(0.5_0.005_90)] text-xs">已获里程</span>
          <span className="font-nunito text-sm text-[oklch(0.45_0.1_140)]">+{mileageEarned} 里</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[oklch(0.5_0.005_90)] text-xs">国力预估</span>
          <span className="font-nunito text-sm text-[oklch(0.8_0.15_90)]">+{powerEarned}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => setRunning(!running)}
          className="flex-1 py-3 rounded-xl font-serif-sc text-sm font-semibold transition-all"
          style={{
            background: running ? 'oklch(0.65 0.12 90 / 0.2)' : 'oklch(0.45 0.1 140 / 0.2)',
            border: `1px solid ${running ? 'oklch(0.65 0.12 90 / 0.4)' : 'oklch(0.45 0.1 140 / 0.4)'}`,
            color: running ? 'oklch(0.65 0.12 90)' : 'oklch(0.45 0.1 140)',
          }}
        >
          {running ? '⏸ 暂停' : '▶ 开始'}
        </button>
        {timer > 0 && (
          <button
            onClick={handleEnd}
            className="py-3 px-4 rounded-xl font-serif-sc text-sm font-semibold"
            style={{ background: 'oklch(0.8 0.15 90)', color: 'oklch(0.1 0.008 270)' }}
          >
            ✓
          </button>
        )}
      </div>
    </div>
  );
}

// Battle Mode (战场指挥)
function WatchBattle({ onBack }: { onBack: () => void }) {
  const { state, startBattle, attackBattle, endBattle } = useGame();
  const [hr, setHr] = useState(state.todayMaxHeartRate);

  useEffect(() => {
    if (state.battlePhase === 'fighting') {
      const interval = setInterval(() => {
        setHr(h => Math.max(60, Math.min(190, h + Math.floor(Math.random() * 11) - 5)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state.battlePhase]);

  const hrZone = getHeartRateZone(hr);
  const currentCampaign = state.campaigns.find(c => c.id === state.currentCampaign);
  const playerHpPercent = (state.battlePlayerHp / state.warlords[0].maxHp) * 100;
  const enemyHpPercent = currentCampaign ? (state.battleEnemyHp / currentCampaign.enemyMaxHp) * 100 : 0;

  const handleVictory = () => {
    endBattle(true);
    onBack();
  };

  return (
    <div className="flex flex-col h-full py-2 px-3 gap-2">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[oklch(0.5_0.005_90)] text-xs">← 返回</button>
        <p className="font-serif-sc text-[oklch(0.6_0.2_20)] text-xs">战场指挥</p>
        <div className="font-nunito text-xs" style={{ color: hrZone.color }}>×{hrZone.multiplier.toFixed(1)}</div>
      </div>

      {/* Enemy */}
      <div className="rounded-xl p-3 text-center" style={{ background: 'oklch(0.6 0.2 20 / 0.1)', border: '1px solid oklch(0.6 0.2 20 / 0.2)' }}>
        <div style={{ fontSize: '28px' }}>{currentCampaign?.enemyEmoji || '⚔️'}</div>
        <p className="font-serif-sc text-xs text-[oklch(0.7_0.005_90)]">{currentCampaign?.enemy || '敌将'}</p>
        <div className="mt-1 h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
          <div className="h-full rounded-full progress-crimson transition-all duration-500" style={{ width: `${enemyHpPercent}%` }} />
        </div>
        <p className="font-nunito text-xs text-[oklch(0.5_0.005_90)] mt-0.5">{state.battleEnemyHp} HP</p>
      </div>

      {/* Battle Log */}
      <div className="flex-1 overflow-hidden rounded-xl p-2" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
        {state.battlePhase === 'idle' ? (
          <p className="text-[oklch(0.4_0.005_90)] text-xs text-center mt-2">点击「出战」开始战斗</p>
        ) : (
          <div className="space-y-1">
            {state.battleLog.slice(0, 3).map((log, i) => (
              <p key={i} className="text-xs slide-in-right" style={{ color: i === 0 ? 'oklch(0.8 0.15 90)' : 'oklch(0.5 0.005 90)', fontSize: '10px' }}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      <div className="rounded-xl p-2" style={{ background: 'oklch(0.45 0.1 140 / 0.1)', border: '1px solid oklch(0.45 0.1 140 / 0.2)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-serif-sc text-xs text-[oklch(0.7_0.005_90)]">{state.warlords[0].name}</span>
          <span className="font-nunito text-xs" style={{ color: hrZone.color }}>{hr} bpm · {hrZone.name}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
          <div className="h-full rounded-full progress-bronze transition-all duration-500" style={{ width: `${playerHpPercent}%` }} />
        </div>
        <p className="font-nunito text-xs text-[oklch(0.5_0.005_90)] mt-0.5">{state.battlePlayerHp} HP</p>
      </div>

      {/* Battle Controls */}
      {state.battlePhase === 'idle' && (
        <button
          onClick={startBattle}
          className="w-full py-3 rounded-xl font-serif-sc text-sm font-semibold command-pulse"
          style={{ background: 'linear-gradient(135deg, oklch(0.5 0.18 20), oklch(0.6 0.2 20))', color: 'white' }}
        >
          ⚔️ 出战
        </button>
      )}
      {state.battlePhase === 'fighting' && (
        <button
          onClick={attackBattle}
          className="w-full py-3 rounded-xl font-serif-sc text-sm font-semibold transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${hrZone.color}80, ${hrZone.color})`, color: 'white' }}
        >
          ⚡ 指挥进攻 ×{hrZone.multiplier.toFixed(1)}
        </button>
      )}
      {state.battlePhase === 'victory' && (
        <button onClick={handleVictory} className="w-full py-3 rounded-xl font-serif-sc text-sm font-semibold" style={{ background: 'oklch(0.45 0.1 140)', color: 'white' }}>
          🎉 大获全胜！+50 国力
        </button>
      )}
      {state.battlePhase === 'defeat' && (
        <button onClick={() => endBattle(false)} className="w-full py-3 rounded-xl font-serif-sc text-sm font-semibold" style={{ background: 'oklch(0.6 0.2 20 / 0.3)', color: 'oklch(0.6 0.2 20)' }}>
          撤退重整
        </button>
      )}
    </div>
  );
}

// Quick Actions (快捷指令)
function WatchQuick({ onBack }: { onBack: () => void }) {
  const { quickAction, state } = useGame();

  const actions = [
    { id: 'order' as const, icon: '📜', label: '发布军令', effect: '国力 +20', color: 'oklch(0.8 0.15 90)' },
    { id: 'reward' as const, icon: '💰', label: '犒赏三军', effect: '国力 +10', color: 'oklch(0.65 0.12 90)' },
    { id: 'comfort' as const, icon: '🤝', label: '安抚民心', effect: '疲劳 -10', color: 'oklch(0.45 0.1 140)' },
    { id: 'scout' as const, icon: '🔭', label: '侦查敌情', effect: '设定提醒', color: 'oklch(0.55 0.12 200)' },
  ];

  const handleAction = (action: typeof actions[0]) => {
    quickAction(action.id);
    toast.success(`${action.label}`, { description: action.effect, style: { background: 'oklch(0.14 0.01 270)', color: 'oklch(0.95 0.005 90)' } });
  };

  return (
    <div className="flex flex-col h-full py-3 px-3">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-[oklch(0.5_0.005_90)] text-xs">← 返回</button>
        <p className="font-serif-sc text-[oklch(0.8_0.15_90)] text-xs">快捷指令</p>
        <div />
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {actions.map(action => (
          <motion.button
            key={action.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction(action)}
            className="rounded-xl p-4 flex flex-col items-center gap-2 transition-all"
            style={{ background: `${action.color}15`, border: `1px solid ${action.color}30` }}
          >
            <span style={{ fontSize: '28px' }}>{action.icon}</span>
            <span className="font-serif-sc text-xs font-semibold" style={{ color: action.color }}>{action.label}</span>
            <span className="text-[oklch(0.5_0.005_90)]" style={{ fontSize: '10px' }}>{action.effect}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-3 text-center">
        <p className="font-nunito text-xs text-[oklch(0.5_0.005_90)]">
          当前国力：<span className="text-[oklch(0.8_0.15_90)] font-bold">{state.nationalPower.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

// Stats Mode (今日国力统计)
function WatchStats({ onBack }: { onBack: () => void }) {
  const { state } = useGame();
  const stepPercent = Math.min((state.todaySteps / state.stepGoal) * 100, 100);
  const adminPercent = Math.min((state.todayDecisions / 10) * 100, 100);
  const diplomacyPercent = Math.min((state.todayDiplomacy / 12) * 100, 100);

  const rings = [
    { label: '行军', value: state.todaySteps.toLocaleString(), unit: '步', percent: stepPercent, color: 'oklch(0.8 0.15 90)', r: 100, sw: 12 },
    { label: '内政', value: state.todayDecisions.toString(), unit: '次', percent: adminPercent, color: 'oklch(0.45 0.1 140)', r: 82, sw: 10 },
    { label: '外交', value: state.todayDiplomacy.toString(), unit: '次', percent: diplomacyPercent, color: 'oklch(0.55 0.12 200)', r: 65, sw: 8 },
  ];

  return (
    <div className="flex flex-col h-full py-3 px-3">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="text-[oklch(0.5_0.005_90)] text-xs">← 返回</button>
        <p className="font-serif-sc text-[oklch(0.8_0.15_90)] text-xs">今日国力</p>
        <div />
      </div>

      {/* Triple Ring */}
      <div className="flex justify-center">
        <svg width="200" height="200" viewBox="0 0 240 240">
          {rings.map((ring, i) => (
            <Ring key={i} radius={ring.r} strokeWidth={ring.sw} percent={ring.percent} color={ring.color} />
          ))}
          <text x="120" y="115" textAnchor="middle" fill="oklch(0.8 0.15 90)" fontSize="22" fontFamily="Nunito" fontWeight="800">
            {state.nationalPower.toLocaleString()}
          </text>
          <text x="120" y="133" textAnchor="middle" fill="oklch(0.5 0.005 90)" fontSize="10" fontFamily="PingFang SC">
            今日国力
          </text>
        </svg>
      </div>

      {/* Stats List */}
      <div className="space-y-2 mt-1">
        {rings.map((ring, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: ring.color }} />
              <span className="text-xs text-[oklch(0.6_0.005_90)]">{ring.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
                <div className="h-full rounded-full transition-all" style={{ width: `${ring.percent}%`, background: ring.color }} />
              </div>
              <span className="font-nunito text-xs font-bold" style={{ color: ring.color }}>{ring.value}</span>
              <span className="text-[oklch(0.4_0.005_90)]" style={{ fontSize: '10px' }}>{ring.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Watch Frame Component
function WatchFrame({ children, mode }: { children: React.ReactNode; mode: string }) {
  return (
    <div className="relative" style={{ width: '280px', height: '340px' }}>
      {/* Watch body */}
      <div
        className="absolute inset-0 rounded-[44px]"
        style={{
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      />
      {/* Screen */}
      <div
        className="absolute rounded-[36px] overflow-hidden"
        style={{
          top: '12px', left: '12px', right: '12px', bottom: '12px',
          background: '#000000',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${WATCH_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {/* Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
      {/* Digital Crown */}
      <div
        className="absolute right-0 top-1/4 w-2 h-8 rounded-r-full"
        style={{ background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)', boxShadow: '2px 0 4px rgba(0,0,0,0.5)' }}
      />
      {/* Side Button */}
      <div
        className="absolute right-0 top-2/3 w-2 h-5 rounded-r-full"
        style={{ background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)', boxShadow: '2px 0 4px rgba(0,0,0,0.5)' }}
      />
      {/* Band connections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-t-full" style={{ background: '#1a1a1a' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-b-full" style={{ background: '#1a1a1a' }} />
    </div>
  );
}

export default function WatchApp() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<'dashboard' | 'military' | 'battle' | 'quick' | 'stats'>('dashboard');
  const { state } = useGame();

  const MODES = [
    { id: 'dashboard', label: '表盘', icon: '⌚' },
    { id: 'military', label: '军务', icon: '📜' },
    { id: 'battle', label: '战场', icon: '⚔️' },
    { id: 'quick', label: '指令', icon: '⚡' },
    { id: 'stats', label: '统计', icon: '📊' },
  ] as const;

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.008_270)] flex flex-col">
      {/* Top Nav */}
      <div
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'oklch(0.1 0.01 270)', borderBottom: '1px solid oklch(1 0 0 / 0.08)' }}
      >
        <button onClick={() => navigate('/')} className="text-[oklch(0.6_0.005_90)] text-sm hover:text-[oklch(0.8_0.15_90)] transition-colors">
          ← 返回
        </button>
        <h1 className="font-serif-sc text-base font-bold text-[oklch(0.8_0.15_90)]">Apple Watch 端</h1>
        <button onClick={() => navigate('/iphone')} className="text-[oklch(0.6_0.005_90)] text-sm hover:text-[oklch(0.8_0.15_90)] transition-colors">
          📱 iPhone
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-6">
        {/* Watch Display */}
        <div className="flex flex-col items-center gap-6">
          <WatchFrame mode={mode}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {mode === 'dashboard' && <WatchDashboard onNavigate={(m) => setMode(m as typeof mode)} />}
                {mode === 'military' && <WatchMilitary onBack={() => setMode('dashboard')} />}
                {mode === 'battle' && <WatchBattle onBack={() => setMode('dashboard')} />}
                {mode === 'quick' && <WatchQuick onBack={() => setMode('dashboard')} />}
                {mode === 'stats' && <WatchStats onBack={() => setMode('dashboard')} />}
              </motion.div>
            </AnimatePresence>
          </WatchFrame>

          {/* Mode Selector */}
          <div className="flex gap-2">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: mode === m.id ? 'oklch(0.8 0.15 90 / 0.15)' : 'oklch(0.14 0.01 270)',
                  border: `1px solid ${mode === m.id ? 'oklch(0.8 0.15 90 / 0.4)' : 'oklch(1 0 0 / 0.08)'}`,
                  color: mode === m.id ? 'oklch(0.8 0.15 90)' : 'oklch(0.5 0.005 270)',
                }}
              >
                <span className="text-base">{m.icon}</span>
                <span className="font-serif-sc text-xs">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 max-w-md space-y-4">
          <div className="iron-card rounded-xl p-5">
            <h2 className="font-serif-sc text-lg font-bold text-[oklch(0.8_0.15_90)] mb-3">Watch 端功能说明</h2>
            <div className="space-y-3">
              {[
                { icon: '⌚', title: '军情速报表盘', desc: '双环进度设计：外环行军步数，内环国力值。实时显示心率、里程、战役进度。' },
                { icon: '📜', title: '军务处理模式', desc: '心率实时监测，计时器记录军务时长，自动结算国力与里程奖励。' },
                { icon: '⚔️', title: '战场指挥模式', desc: '心率决定指挥倍率（×1.0–×1.5），临危不乱者战力更强。' },
                { icon: '⚡', title: '快捷指令面板', desc: '四项一键操作：发布军令、犒赏三军、安抚民心、侦查敌情。' },
                { icon: '📊', title: '今日国力统计', desc: '仿 Apple Fitness 三环设计：行军环、内政环、外交环。' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)]">{item.title}</p>
                    <p className="text-xs text-[oklch(0.55_0.005_90)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Data */}
          <div className="iron-card rounded-xl p-5">
            <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)] mb-3">实时数据</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '今日步数', value: state.todaySteps.toLocaleString(), unit: '步', color: 'oklch(0.8 0.15 90)' },
                { label: '当前心率', value: state.todayHeartRate.toString(), unit: 'bpm', color: getHeartRateZone(state.todayHeartRate).color },
                { label: '国力值', value: state.nationalPower.toLocaleString(), unit: '', color: 'oklch(0.8 0.15 90)' },
                { label: '疲劳值', value: state.fatigueValue.toString(), unit: '/ 100', color: state.fatigueValue > 50 ? 'oklch(0.6 0.2 20)' : 'oklch(0.45 0.1 140)' },
              ].map((d, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
                  <div className="font-nunito text-xl font-bold" style={{ color: d.color }}>{d.value}</div>
                  <div className="text-xs text-[oklch(0.4_0.005_90)]">{d.unit} {d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
