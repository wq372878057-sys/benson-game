/**
 * 武将招募与养成系统
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Warlord } from '@/lib/gameStore';
import { toast } from 'sonner';

const WARLORD_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RFNZ6irBkA3J3x2UatnzHz/sanguo-warlord-panel-CNMyHgBRLCAaQKqw4MyJrZ.webp';

const moodColors: Record<string, string> = {
  '昂扬': 'oklch(0.45 0.1 140)',
  '平静': 'oklch(0.55 0.12 200)',
  '疲惫': 'oklch(0.65 0.12 90)',
  '动摇': 'oklch(0.6 0.2 20)',
};

const moodBg: Record<string, string> = {
  '昂扬': 'oklch(0.45 0.1 140 / 0.15)',
  '平静': 'oklch(0.55 0.12 200 / 0.15)',
  '疲惫': 'oklch(0.65 0.12 90 / 0.15)',
  '动摇': 'oklch(0.6 0.2 20 / 0.15)',
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[oklch(0.5_0.005_90)] text-xs w-4">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="font-nunito text-xs text-[oklch(0.7_0.005_90)] w-6 text-right">{value}</span>
    </div>
  );
}

function WarlordCard({ warlord, onClick, isSelected }: { warlord: Warlord; onClick: () => void; isSelected: boolean }) {
  const allHighMood = warlord.mood === '昂扬' || warlord.mood === '平静';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="warlord-card rounded-xl p-4 cursor-pointer"
      style={{
        background: isSelected ? 'oklch(0.18 0.012 270)' : 'oklch(0.14 0.01 270)',
        border: `1px solid ${isSelected ? 'oklch(0.8 0.15 90 / 0.4)' : 'oklch(1 0 0 / 0.08)'}`,
        boxShadow: isSelected ? '0 0 20px oklch(0.8 0.15 90 / 0.15)' : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${warlord.color.replace(')', ' / 0.15)')}` }}
        >
          {warlord.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-serif-sc text-base font-bold text-[oklch(0.95_0.005_90)]">{warlord.name}</span>
            <span className="text-xs text-[oklch(0.5_0.005_90)]">Lv.{warlord.level}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-serif-sc"
              style={{ color: moodColors[warlord.mood], background: moodBg[warlord.mood] }}
            >
              {warlord.mood}
            </span>
          </div>
          <p className="text-xs text-[oklch(0.5_0.005_90)] mb-2">{warlord.title} · {warlord.strategySpecialty}</p>

          {/* HP Bar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[oklch(0.5_0.005_90)] text-xs">HP</span>
            <div className="flex-1 h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(warlord.hp / warlord.maxHp) * 100}%`,
                  background: warlord.hp / warlord.maxHp > 0.6 ? 'oklch(0.45 0.1 140)' : 'oklch(0.6 0.2 20)',
                }}
              />
            </div>
            <span className="font-nunito text-xs text-[oklch(0.6_0.005_90)]">{warlord.hp}/{warlord.maxHp}</span>
          </div>

          {/* Loyalty */}
          <div className="flex items-center gap-2">
            <span className="text-[oklch(0.5_0.005_90)] text-xs">忠</span>
            <div className="flex-1 h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
              <div
                className="h-full rounded-full progress-gold"
                style={{ width: `${warlord.loyalty}%` }}
              />
            </div>
            <span className="font-nunito text-xs text-[oklch(0.8_0.15_90)]">{warlord.loyalty}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WarlordsTab() {
  const { state, dispatch } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>('guanyu');

  const selected = state.warlords.find(w => w.id === selectedId);
  const allHighMood = state.warlords.every(w => w.mood === '昂扬' || w.mood === '平静');

  const handleBoost = () => {
    toast.success('犒赏三军！', {
      description: '武将士气全面提升，国力 +10',
      style: { background: 'oklch(0.14 0.01 270)', border: '1px solid oklch(0.8 0.15 90 / 0.3)', color: 'oklch(0.95 0.005 90)' },
    });
    dispatch({ type: 'ADD_POWER', amount: 10 });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif-sc text-xl font-bold text-[oklch(0.95_0.005_90)]">麾下武将</h2>
          <span className="text-sm text-[oklch(0.5_0.005_90)]">{state.warlords.length} 位</span>
        </div>
        {allHighMood && (
          <div
            className="rounded-lg px-3 py-2 flex items-center gap-2"
            style={{ background: 'oklch(0.45 0.1 140 / 0.15)', border: '1px solid oklch(0.45 0.1 140 / 0.3)' }}
          >
            <span className="text-sm">✨</span>
            <span className="text-[oklch(0.45_0.1_140)] text-xs font-semibold">同心同德 · 当日国力 +20%</span>
          </div>
        )}
      </div>

      {/* Hero Image */}
      <div className="mx-4 rounded-xl overflow-hidden h-32 mb-4 relative">
        <img src={WARLORD_IMG} alt="武将" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.008_270/0.8)] via-transparent to-[oklch(0.08_0.008_270/0.8)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif-sc text-[oklch(0.8_0.15_90)] text-lg font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            英雄麾下，共赴乱世
          </p>
        </div>
      </div>

      {/* Warlord List */}
      <div className="px-4 space-y-3 mb-4">
        {state.warlords.map(w => (
          <WarlordCard
            key={w.id}
            warlord={w}
            onClick={() => setSelectedId(w.id === selectedId ? null : w.id)}
            isSelected={selectedId === w.id}
          />
        ))}
      </div>

      {/* Selected Warlord Detail */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 gold-border-card rounded-xl p-4"
        >
          <h3 className="font-serif-sc text-base font-bold text-[oklch(0.8_0.15_90)] mb-3">
            {selected.name} · 属性详情
          </h3>
          <div className="space-y-2 mb-4">
            <StatBar label="武" value={selected.martialPower} color="oklch(0.6 0.2 20)" />
            <StatBar label="智" value={selected.intelligence} color="oklch(0.8 0.15 90)" />
            <StatBar label="统" value={selected.command} color="oklch(0.45 0.1 140)" />
            <StatBar label="政" value={selected.politics} color="oklch(0.55 0.12 200)" />
          </div>
          <p className="text-[oklch(0.55_0.005_90)] text-xs leading-relaxed mb-3">{selected.description}</p>
          {selected.equippedRelic && (
            <div
              className="rounded-lg px-3 py-2 flex items-center gap-2"
              style={{ background: 'oklch(0.8 0.15 90 / 0.1)', border: '1px solid oklch(0.8 0.15 90 / 0.2)' }}
            >
              <span>💎</span>
              <span className="text-[oklch(0.8_0.15_90)] text-xs">
                已装备：{state.relics.find(r => r.id === selected.equippedRelic)?.name || '未知宝物'}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Action Button */}
      <div className="px-4 pb-6">
        <button
          onClick={handleBoost}
          className="w-full py-3 rounded-xl font-serif-sc text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'oklch(0.18 0.012 270)', border: '1px solid oklch(0.8 0.15 90 / 0.2)', color: 'oklch(0.8 0.15 90)' }}
        >
          💰 犒赏三军 — 恢复武将士气
        </button>
      </div>
    </div>
  );
}
