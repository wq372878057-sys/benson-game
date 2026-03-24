/**
 * iPhone端 - 兵器谱·宝物图鉴
 * Design: 水墨江湖·沉浸叙事
 */

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Weapon, WeaponGrade } from '@/lib/gameData';

const WEAPONS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RUixAFWpWkwbNMtYmRxaaK/weapons-bg-jLZStGwkiMXZXGCyWW74hi.webp';

const gradeConfig: Record<WeaponGrade, { color: string; bg: string; border: string; label: string; glow: string }> = {
  '神兵': {
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/40',
    label: '神兵',
    glow: '0 0 20px oklch(0.78 0.12 75 / 30%)',
  },
  '宝物': {
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/40',
    label: '宝物',
    glow: '0 0 20px oklch(0.55 0.18 290 / 30%)',
  },
  '凡品': {
    color: 'text-white/60',
    bg: 'bg-white/5',
    border: 'border-white/15',
    label: '凡品',
    glow: 'none',
  },
};

function WeaponCard({ weapon, onSelect }: { weapon: Weapon; onSelect: (w: Weapon) => void }) {
  const grade = gradeConfig[weapon.grade];

  return (
    <button
      onClick={() => onSelect(weapon)}
      className={`ink-card p-3 text-left transition-all ${weapon.obtained ? '' : 'opacity-50'}`}
      style={{ boxShadow: weapon.obtained ? grade.glow : 'none' }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${grade.border} ${grade.bg}`}>
          {weapon.obtained ? weapon.emoji : '❓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded border ${grade.bg} ${grade.border} ${grade.color}`}>
              {grade.label}
            </span>
            <span className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {weapon.obtained ? weapon.name : '???'}
            </span>
          </div>
          <div className="text-xs text-white/40 mb-1">{weapon.owner}</div>
          {weapon.obtained ? (
            <div className="text-xs text-white/60 leading-relaxed line-clamp-2">{weapon.effect}</div>
          ) : (
            <div className="text-xs text-white/30">{weapon.obtainCondition}</div>
          )}
        </div>
      </div>
    </button>
  );
}

function WeaponDetail({ weapon, onClose }: { weapon: Weapon; onClose: () => void }) {
  const grade = gradeConfig[weapon.grade];

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-h-[80vh] overflow-y-auto rounded-t-2xl" style={{ background: 'oklch(0.16 0.006 285)' }}>
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10" style={{ background: 'oklch(0.16 0.006 285)' }}>
          <h3 className="font-bold text-white" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {weapon.obtained ? weapon.name : '???'}
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* 兵器展示 */}
          <div className="flex flex-col items-center py-6">
            <div
              className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl border ${grade.border} ${grade.bg} mb-4`}
              style={{ boxShadow: weapon.obtained ? grade.glow : 'none' }}
            >
              {weapon.obtained ? weapon.emoji : '❓'}
            </div>
            <span className={`text-sm px-3 py-1 rounded-full border ${grade.bg} ${grade.border} ${grade.color}`}>
              {grade.label}
            </span>
          </div>

          {weapon.obtained ? (
            <>
              {/* 归属 */}
              <div className="ink-card p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">归属好汉</span>
                  <span className="text-sm text-white">{weapon.owner}</span>
                </div>
              </div>

              {/* 效果 */}
              <div className="ink-card p-3">
                <h4 className="text-xs text-amber-400 mb-2">⚔️ 战斗效果</h4>
                <p className="text-sm text-white/80">{weapon.effect}</p>
              </div>

              {/* 描述 */}
              <div className="ink-card p-3">
                <h4 className="text-xs text-white/40 mb-2">典故</h4>
                <p className="text-sm text-white/60 leading-relaxed">{weapon.description}</p>
              </div>
            </>
          ) : (
            <div className="ink-card p-4 text-center">
              <div className="text-3xl mb-3">🔒</div>
              <div className="text-sm text-white/60 mb-2">此兵器尚未获得</div>
              <div className="text-xs text-amber-400">{weapon.obtainCondition}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WeaponsScreen() {
  const { state } = useGame();
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [filterGrade, setFilterGrade] = useState<WeaponGrade | 'all'>('all');

  const obtainedCount = state.weapons.filter(w => w.obtained).length;
  const totalCount = state.weapons.length;

  const filteredWeapons = filterGrade === 'all'
    ? state.weapons
    : state.weapons.filter(w => w.grade === filterGrade);

  const grades: (WeaponGrade | 'all')[] = ['all', '神兵', '宝物', '凡品'];

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* 兵器横幅 */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 140 }}>
        <img src={WEAPONS_BG} alt="兵器谱" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Serif SC, serif' }}>兵器谱</h2>
              <p className="text-xs text-white/60">已收集 {obtainedCount} / {totalCount} 件</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">{Math.round((obtainedCount / totalCount) * 100)}%</div>
              <div className="text-xs text-white/60">收集进度</div>
            </div>
          </div>
        </div>
      </div>

      {/* 收集进度 */}
      <div className="ink-card p-3">
        <div className="ink-progress h-2">
          <div className="ink-progress-bar" style={{ width: `${(obtainedCount / totalCount) * 100}%`, background: 'linear-gradient(90deg, #F39C12, #E67E22)' }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-white/40">
          <span>神兵 {state.weapons.filter(w => w.grade === '神兵' && w.obtained).length}/{state.weapons.filter(w => w.grade === '神兵').length}</span>
          <span>宝物 {state.weapons.filter(w => w.grade === '宝物' && w.obtained).length}/{state.weapons.filter(w => w.grade === '宝物').length}</span>
          <span>凡品 {state.weapons.filter(w => w.grade === '凡品' && w.obtained).length}/{state.weapons.filter(w => w.grade === '凡品').length}</span>
        </div>
      </div>

      {/* 品级筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {grades.map(grade => (
          <button
            key={grade}
            onClick={() => setFilterGrade(grade)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterGrade === grade
                ? grade === 'all' ? 'bg-red-900/60 border-red-500/50 text-white' :
                  grade === '神兵' ? 'bg-amber-400/20 border-amber-400/50 text-amber-400' :
                  grade === '宝物' ? 'bg-purple-400/20 border-purple-400/50 text-purple-400' :
                  'bg-white/10 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {grade === 'all' ? '全部' : grade}
          </button>
        ))}
      </div>

      {/* 兵器列表 */}
      <div className="space-y-2">
        {filteredWeapons.map(weapon => (
          <WeaponCard key={weapon.id} weapon={weapon} onSelect={setSelectedWeapon} />
        ))}
      </div>

      {selectedWeapon && (
        <WeaponDetail weapon={selectedWeapon} onClose={() => setSelectedWeapon(null)} />
      )}
    </div>
  );
}
