/**
 * 宝物图鉴与装备系统
 */

import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Relic } from '@/lib/gameStore';

const gradeConfig = {
  '神品': { color: 'oklch(0.8 0.15 90)', bg: 'oklch(0.8 0.15 90 / 0.12)', border: 'oklch(0.8 0.15 90 / 0.3)', glow: true },
  '仙品': { color: 'oklch(0.55 0.12 200)', bg: 'oklch(0.55 0.12 200 / 0.12)', border: 'oklch(0.55 0.12 200 / 0.3)', glow: false },
  '凡品': { color: 'oklch(0.45 0.1 140)', bg: 'oklch(0.45 0.1 140 / 0.12)', border: 'oklch(0.45 0.1 140 / 0.3)', glow: false },
};

function RelicCard({ relic }: { relic: Relic }) {
  const cfg = gradeConfig[relic.grade];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-4 ${relic.obtained && relic.grade === '神品' ? 'relic-divine' : ''}`}
      style={{
        background: relic.obtained ? cfg.bg : 'oklch(0.12 0.008 270)',
        border: `1px solid ${relic.obtained ? cfg.border : 'oklch(1 0 0 / 0.06)'}`,
        opacity: relic.obtained ? 1 : 0.5,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: relic.obtained ? cfg.bg : 'oklch(1 0 0 / 0.04)' }}
        >
          {relic.obtained ? relic.emoji : '❓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="font-serif-sc text-sm font-bold"
              style={{ color: relic.obtained ? cfg.color : 'oklch(0.4 0.005 270)' }}
            >
              {relic.obtained ? relic.name : '???'}
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ color: cfg.color, background: cfg.bg }}
            >
              {relic.grade}
            </span>
          </div>
          {relic.obtained ? (
            <>
              <p className="text-xs text-[oklch(0.6_0.005_90)] mb-1">{relic.effect}</p>
              <p className="text-xs text-[oklch(0.45_0.005_90)]">持有者：{relic.holder}</p>
            </>
          ) : (
            <>
              <p className="text-xs text-[oklch(0.4_0.005_90)] mb-1">获取方式：{relic.obtainMethod}</p>
              <p className="text-xs text-[oklch(0.35_0.005_90)]">持有者：{relic.holder}</p>
            </>
          )}
        </div>
        {relic.obtained && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.45 0.1 140)' }}>
            <span className="text-xs text-white">✓</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RelicsTab() {
  const { state } = useGame();
  const obtained = state.relics.filter(r => r.obtained).length;
  const total = state.relics.length;
  const percent = (obtained / total) * 100;

  const divine = state.relics.filter(r => r.grade === '神品');
  const celestial = state.relics.filter(r => r.grade === '仙品');
  const mortal = state.relics.filter(r => r.grade === '凡品');

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif-sc text-xl font-bold text-[oklch(0.95_0.005_90)]">宝物图鉴</h2>
          <span className="font-nunito text-sm text-[oklch(0.8_0.15_90)] font-bold">{obtained} / {total}</span>
        </div>

        {/* Collection Progress */}
        <div className="iron-card rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[oklch(0.7_0.005_90)]">收集进度</span>
            <span className="font-nunito text-sm font-bold text-[oklch(0.8_0.15_90)]">{percent.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-[oklch(1_0_0/0.08)] overflow-hidden">
            <motion.div
              className="h-full rounded-full progress-gold"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            {[
              { label: '神品', count: divine.filter(r => r.obtained).length, total: divine.length, color: 'oklch(0.8 0.15 90)' },
              { label: '仙品', count: celestial.filter(r => r.obtained).length, total: celestial.length, color: 'oklch(0.55 0.12 200)' },
              { label: '凡品', count: mortal.filter(r => r.obtained).length, total: mortal.length, color: 'oklch(0.45 0.1 140)' },
            ].map((g, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                <span style={{ color: g.color }}>{g.label}</span>
                <span className="text-[oklch(0.5_0.005_90)]">{g.count}/{g.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divine Relics */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-[oklch(0.8_0.15_90)]" />
          <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.8_0.15_90)]">神品宝物</h3>
        </div>
        <div className="space-y-3">
          {divine.map(r => <RelicCard key={r.id} relic={r} />)}
        </div>
      </div>

      {/* Celestial Relics */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-[oklch(0.55_0.12_200)]" />
          <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.55_0.12_200)]">仙品宝物</h3>
        </div>
        <div className="space-y-3">
          {celestial.map(r => <RelicCard key={r.id} relic={r} />)}
        </div>
      </div>

      {/* Mortal Relics */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-[oklch(0.45_0.1_140)]" />
          <h3 className="font-serif-sc text-sm font-semibold text-[oklch(0.45_0.1_140)]">凡品宝物</h3>
        </div>
        <div className="space-y-3">
          {mortal.map(r => <RelicCard key={r.id} relic={r} />)}
        </div>
      </div>
    </div>
  );
}
