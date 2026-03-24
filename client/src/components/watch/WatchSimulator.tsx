/**
 * Apple Watch 端模拟器
 * Design: 水墨江湖·沉浸叙事 - 深色OLED + 英雄红 + 金黄
 * 精确还原 Apple Watch Series 9 圆角矩形形态
 */

import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { getHeartRateZone, getAttackMultiplier } from '@/lib/gameData';
import { toast } from 'sonner';

const WATCH_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RUixAFWpWkwbNMtYmRxaaK/watch-bg-66jkpUXSXfQvsgsgnWyQpP.webp';

// 表盘环形进度组件
function RingProgress({ 
  value, max, radius, strokeWidth, color, bg = 'rgba(255,255,255,0.08)'
}: { 
  value: number; max: number; radius: number; strokeWidth: number; color: string; bg?: string 
}) {
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - progress);
  const size = (radius + strokeWidth) * 2;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bg} strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

// 表盘主界面
function DialScreen() {
  const { state, setWatchScreen } = useGame();
  const { dailyHealth, loyaltyValue, evilValue, currentBattle, watchState } = state;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const stepsPercent = dailyHealth.steps / dailyHealth.stepGoal;
  const loyaltyPercent = (loyaltyValue % 5000) / 5000;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ background: '#0A0A0A' }}>
      {/* 双环进度 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* 外环 - 步数 */}
          <RingProgress value={dailyHealth.steps} max={dailyHealth.stepGoal} radius={88} strokeWidth={8} color="#1A1A1A" />
          <div className="absolute inset-0 flex items-center justify-center">
            <RingProgress value={dailyHealth.steps} max={dailyHealth.stepGoal} radius={88} strokeWidth={8} color="rgba(255,255,255,0.15)" />
          </div>
          {/* 外环实际进度 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <RingProgress value={dailyHealth.steps} max={dailyHealth.stepGoal} radius={88} strokeWidth={8} color="rgba(200,200,200,0.8)" />
          </div>
          {/* 内环 - 忠义 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <RingProgress value={loyaltyValue % 5000} max={5000} radius={70} strokeWidth={8} color="#C0392B" />
          </div>
        </div>
      </div>

      {/* 中心内容 */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* 品牌 */}
        <div className="text-xs text-amber-400/70 mb-1 tracking-widest" style={{ fontSize: '9px' }}>梁山风云录</div>
        
        {/* 时间 */}
        <div className="font-bold text-white leading-none mb-1" style={{ fontSize: '42px', letterSpacing: '-2px', fontFamily: 'system-ui' }}>
          {hours}:{minutes}
        </div>
        
        {/* 日期 */}
        <div className="text-white/50 mb-2" style={{ fontSize: '11px' }}>
          {time.getMonth() + 1}月{time.getDate()}日 周{weekdays[time.getDay()]}
        </div>
        
        {/* 数据行 */}
        <div className="flex items-center gap-3 text-white/70" style={{ fontSize: '11px' }}>
          <span>👣 {(dailyHealth.steps / 1000).toFixed(1)}k</span>
          <span className="text-red-400">❤️ {watchState.currentHeartRate}</span>
          <span className="text-amber-400">⚔️ 第{currentBattle}战</span>
        </div>

        {/* 恶念警示 */}
        {evilValue > 30 && (
          <div className="mt-2 px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(139,92,246,0.3)', color: '#A78BFA', fontSize: '10px' }}>
            ⚠️ 恶念 {evilValue} · 需习武克服
          </div>
        )}
      </div>

      {/* 底部快捷入口 */}
      <div className="absolute bottom-6 flex gap-4">
        {[
          { icon: '🏃', screen: 'workout' as const, label: '习武' },
          { icon: '⚔️', screen: 'battle' as const, label: '战役' },
          { icon: '⚡', screen: 'quick' as const, label: '快捷' },
        ].map(btn => (
          <button
            key={btn.screen}
            onClick={() => setWatchScreen(btn.screen)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              {btn.icon}
            </div>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* 环形图例 */}
      <div className="absolute top-6 left-4 flex flex-col gap-1">
        <div className="flex items-center gap-1" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(200,200,200,0.8)' }} />
          <span>步数</span>
        </div>
        <div className="flex items-center gap-1" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#C0392B' }} />
          <span>忠义</span>
        </div>
      </div>
    </div>
  );
}

// 习武运动模式
function WorkoutScreen() {
  const { state, startWorkout, endWorkout, setWatchScreen } = useGame();
  const { watchState } = state;
  const hrZone = getHeartRateZone(watchState.currentHeartRate);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEnd = () => {
    endWorkout();
    toast.success('习武结束', { description: `消耗 ${watchState.workoutCalories.toFixed(0)} 千卡，获得忠义 +${Math.floor(watchState.workoutCalories / 10)}` });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-6 px-4" style={{ background: '#0A0A0A' }}>
      {/* 顶部 */}
      <div className="text-center">
        <div className="text-xs text-amber-400/70 mb-1">鲁智深·爆发训练</div>
        <div className="text-white/40 text-xs">{watchState.workoutActive ? '习武中' : '准备习武'}</div>
      </div>

      {/* 心率大字 */}
      <div className="flex flex-col items-center">
        <div className="font-bold leading-none" style={{ fontSize: '64px', color: hrZone.color, fontFamily: 'system-ui', transition: 'color 0.5s' }}>
          {watchState.currentHeartRate}
        </div>
        <div className="text-sm text-white/40">bpm</div>
        <div className="mt-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${hrZone.color}20`, color: hrZone.color }}>
          {hrZone.zone}
        </div>
      </div>

      {/* 数据行 */}
      <div className="grid grid-cols-3 gap-2 w-full text-center">
        <div>
          <div className="font-bold text-white" style={{ fontSize: '18px' }}>{formatTime(watchState.workoutTime)}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>时长</div>
        </div>
        <div>
          <div className="font-bold text-orange-400" style={{ fontSize: '18px' }}>{watchState.workoutCalories.toFixed(0)}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>千卡</div>
        </div>
        <div>
          <div className="font-bold text-blue-400" style={{ fontSize: '18px' }}>{watchState.workoutMiles.toFixed(2)}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>里程</div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        {watchState.workoutActive ? (
          <>
            <button
              onClick={handleEnd}
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(192,57,43,0.3)', border: '2px solid #C0392B' }}
            >
              ✓
            </button>
            <button
              onClick={() => {}}
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)' }}
            >
              ⏸
            </button>
          </>
        ) : (
          <button
            onClick={startWorkout}
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
            style={{ background: 'linear-gradient(135deg, #C0392B, #922B21)', border: '2px solid #E74C3C' }}
          >
            ▶
          </button>
        )}
      </div>

      {/* 返回 */}
      <button onClick={() => setWatchScreen('dial')} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
        ← 返回表盘
      </button>
    </div>
  );
}

// 梁山战役模式
function BattleScreen() {
  const { state, watchAttack, setWatchScreen } = useGame();
  const { watchState } = state;
  const multiplier = getAttackMultiplier(watchState.currentHeartRate);
  const [attacking, setAttacking] = useState(false);

  const enemyHpPercent = (watchState.battleEnemyHp / 600) * 100;
  const heroHpPercent = (watchState.battleHeroHp / 1000) * 100;

  const handleAttack = async () => {
    if (watchState.battleEnemyHp <= 0) return;
    setAttacking(true);
    watchAttack();
    await new Promise(r => setTimeout(r, 300));
    setAttacking(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col py-4 px-3" style={{ background: '#0A0A0A' }}>
      {/* 敌方区域 */}
      <div className="text-center mb-3">
        <div className="text-3xl mb-1">{watchState.battleEnemyEmoji}</div>
        <div className="text-white font-semibold" style={{ fontSize: '13px', fontFamily: 'Noto Serif SC, serif' }}>
          {watchState.battleEnemyName}
        </div>
        <div className="mt-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.max(enemyHpPercent, 0)}%`, background: 'linear-gradient(90deg, #E74C3C, #C0392B)' }}
          />
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }} className="mt-0.5">
          {watchState.battleEnemyHp} / 600
        </div>
      </div>

      {/* 战斗日志 */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {watchState.battleLog.slice(-2).map((log, i) => (
            <div key={i} style={{ fontSize: '10px', color: i === watchState.battleLog.length - 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* 玩家区域 */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>鲁智深</span>
          <span style={{ fontSize: '11px', color: '#F39C12' }}>×{multiplier} 攻击倍率</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.max(heroHpPercent, 0)}%`, background: 'linear-gradient(90deg, #27AE60, #2ECC71)' }}
          />
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }} className="mt-0.5">
          {watchState.battleHeroHp} / 1000
        </div>
      </div>

      {/* 攻击按钮 */}
      <div className="flex gap-3 justify-center">
        {watchState.battleEnemyHp <= 0 ? (
          <div className="text-center">
            <div className="text-2xl mb-1">🎉</div>
            <div className="text-green-400 font-bold" style={{ fontSize: '12px' }}>首恶已除！</div>
            <div className="text-amber-400" style={{ fontSize: '11px' }}>忠义 +50</div>
          </div>
        ) : (
          <button
            onClick={handleAttack}
            disabled={attacking}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${attacking ? 'animate-battle-flash' : ''}`}
            style={{ background: 'linear-gradient(135deg, #C0392B, #922B21)', border: '2px solid #E74C3C' }}
          >
            ⚔️
          </button>
        )}
        <button
          onClick={() => setWatchScreen('dial')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.08)', fontSize: '16px' }}
        >
          ←
        </button>
      </div>
    </div>
  );
}

// 快捷操作面板
function QuickScreen() {
  const { quickAction, setWatchScreen } = useGame();
  const [lastAction, setLastAction] = useState<string | null>(null);

  const actions = [
    { id: 'drink' as const, icon: '🍻', label: '饮酒', effect: '+20 忠义', color: '#E67E22' },
    { id: 'reward' as const, icon: '💰', label: '赏金', effect: '+10 忠义', color: '#F39C12' },
    { id: 'repent' as const, icon: '🙏', label: '悔过', effect: '-10 恶念', color: '#8E44AD' },
    { id: 'summon' as const, icon: '📢', label: '召集', effect: '设定提醒', color: '#2980B9' },
  ];

  const handleAction = (action: typeof actions[0]) => {
    quickAction(action.id);
    setLastAction(action.label);
    toast.success(`${action.label}`, { description: action.effect });
    setTimeout(() => setLastAction(null), 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-4 px-3" style={{ background: '#0A0A0A' }}>
      <div className="text-xs text-amber-400/70">快捷操作</div>
      
      {lastAction && (
        <div className="absolute top-10 left-0 right-0 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs text-white" style={{ background: 'rgba(192,57,43,0.4)' }}>
            {lastAction} 已执行
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
            style={{ background: `${action.color}15`, border: `1px solid ${action.color}30` }}
          >
            <span className="text-2xl">{action.icon}</span>
            <div>
              <div className="text-white font-semibold" style={{ fontSize: '12px' }}>{action.label}</div>
              <div style={{ fontSize: '10px', color: action.color }}>{action.effect}</div>
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => setWatchScreen('dial')} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
        ← 返回表盘
      </button>
    </div>
  );
}

// 今日功课统计
function StatsScreen() {
  const { state, setWatchScreen } = useGame();
  const { dailyHealth, loyaltyValue } = state;

  const rings = [
    { label: '步数', value: dailyHealth.steps, max: dailyHealth.stepGoal, color: 'rgba(200,200,200,0.8)', radius: 80, strokeWidth: 8 },
    { label: '活动', value: dailyHealth.activeMinutes, max: 60, color: '#27AE60', radius: 62, strokeWidth: 8 },
    { label: '站立', value: 8, max: 12, color: '#C0392B', radius: 44, strokeWidth: 8 },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-4 px-3" style={{ background: '#0A0A0A' }}>
      <div className="text-xs text-amber-400/70">今日功课</div>

      {/* 三环 */}
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {rings.map((ring, i) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center">
            <RingProgress value={ring.value} max={ring.max} radius={ring.radius} strokeWidth={ring.strokeWidth} color={ring.color} />
          </div>
        ))}
        <div className="relative z-10 text-center">
          <div className="text-amber-400 font-bold" style={{ fontSize: '16px' }}>今日</div>
          <div className="text-white/40" style={{ fontSize: '11px' }}>功课</div>
        </div>
      </div>

      {/* 数据列表 */}
      <div className="w-full space-y-2">
        {[
          { icon: '👣', label: '步数', value: `${dailyHealth.steps.toLocaleString()} 步`, color: 'rgba(200,200,200,0.8)' },
          { icon: '⏱️', label: '活动', value: `${dailyHealth.activeMinutes} 分钟`, color: '#27AE60' },
          { icon: '🧍', label: '站立', value: `8 小时`, color: '#C0392B' },
          { icon: '⚖️', label: '忠义', value: `+${Math.min(Math.floor(dailyHealth.steps / 1000) * 10, 100)}`, color: '#F39C12' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '12px', color: item.color, fontWeight: 'bold' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setWatchScreen('dial')} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
        ← 返回表盘
      </button>
    </div>
  );
}

// Apple Watch 外壳
export default function WatchSimulator() {
  const { state, setWatchScreen } = useGame();
  const { watchState } = state;

  const screens = {
    dial: <DialScreen />,
    workout: <WorkoutScreen />,
    battle: <BattleScreen />,
    quick: <QuickScreen />,
    stats: <StatsScreen />,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Watch 外壳 */}
      <div className="relative" style={{ width: 220, height: 260 }}>
        {/* 外壳 */}
        <div
          className="absolute inset-0 rounded-[40px]"
          style={{
            background: 'linear-gradient(145deg, #3A3A3C, #1C1C1E)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        />
        
        {/* Digital Crown - 右上 */}
        <div
          className="absolute rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            right: -8,
            top: 60,
            width: 12,
            height: 36,
            background: 'linear-gradient(90deg, #2C2C2E, #3A3A3C)',
            boxShadow: '2px 0 4px rgba(0,0,0,0.5)',
            borderRadius: '6px',
          }}
          onClick={() => setWatchScreen('stats')}
          title="Digital Crown - 今日统计"
        />
        
        {/* 侧边按钮 - 右下 */}
        <div
          className="absolute rounded cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            right: -8,
            top: 110,
            width: 12,
            height: 20,
            background: 'linear-gradient(90deg, #2C2C2E, #3A3A3C)',
            boxShadow: '2px 0 4px rgba(0,0,0,0.5)',
            borderRadius: '4px',
          }}
          onClick={() => setWatchScreen('quick')}
          title="侧边按钮 - 快捷操作"
        />

        {/* 表盘区域 */}
        <div
          className="absolute overflow-hidden"
          style={{
            inset: 8,
            borderRadius: '34px',
            background: '#0A0A0A',
          }}
        >
          {screens[watchState.currentScreen]}
        </div>
      </div>

      {/* 表带 */}
      <div style={{ width: 180, height: 30, background: 'linear-gradient(180deg, #1C1C1E, #2C2C2E)', borderRadius: '0 0 8px 8px', marginTop: -4 }} />

      {/* 屏幕导航 */}
      <div className="flex gap-2 mt-4">
        {[
          { screen: 'dial' as const, label: '表盘', icon: '⌚' },
          { screen: 'workout' as const, label: '习武', icon: '🏃' },
          { screen: 'battle' as const, label: '战役', icon: '⚔️' },
          { screen: 'quick' as const, label: '快捷', icon: '⚡' },
          { screen: 'stats' as const, label: '统计', icon: '📊' },
        ].map(btn => (
          <button
            key={btn.screen}
            onClick={() => setWatchScreen(btn.screen)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
              watchState.currentScreen === btn.screen ? 'bg-red-900/40 border border-red-500/30' : 'bg-white/5 border border-white/8'
            }`}
          >
            <span style={{ fontSize: '14px' }}>{btn.icon}</span>
            <span style={{ fontSize: '9px', color: watchState.currentScreen === btn.screen ? '#E74C3C' : 'rgba(255,255,255,0.4)' }}>
              {btn.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
