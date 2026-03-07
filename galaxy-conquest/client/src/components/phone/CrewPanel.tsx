// ============================================================
// 手机端 - 船员管理界面
// ============================================================
import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import type { Character } from '../../lib/gameTypes';

const statusConfig = {
  energized: { label: '斗志昂扬', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  focused: { label: '平静专注', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  tired: { label: '疲惫', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  wavering: { label: '动摇', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
};

function StatBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-white/50">{label}</span>
        <span className="font-mono-tech text-white/70">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

function CharacterCard({ char, selected, onClick }: { char: Character; selected: boolean; onClick: () => void }) {
  const status = statusConfig[char.status];
  const equippedGear = useGame().state.gear.find(g => g.id === char.equippedGearId);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-4 transition-all duration-200 ${
        selected
          ? 'glass-card-blue glow-blue scale-[1.02]'
          : 'glass-card hover:glass-card-blue'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
          selected ? 'bg-blue-500/20' : 'bg-white/5'
        }`}>
          {char.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-white font-semibold text-sm">{char.name}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-white/50 text-xs mb-2">{char.title}</p>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/40">Lv.{char.level}</span>
            <span className="text-white/40">HP {char.hp}/{char.maxHp}</span>
            {equippedGear && (
              <span className="text-amber-400/70">{equippedGear.icon} {equippedGear.name}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function CrewPanel() {
  const { state } = useGame();
  const [selectedId, setSelectedId] = useState('player');
  
  const selected = state.characters.find(c => c.id === selectedId) || state.characters[0];
  const equippedGear = state.gear.find(g => g.id === selected.equippedGearId);

  const allEnergized = state.characters.every(c => c.status === 'energized' || c.status === 'focused');

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="px-4 pt-4 space-y-3">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-white text-base">船员管理</h2>
          {allEnergized && (
            <span className="text-xs glass-card-blue px-3 py-1 rounded-full text-blue-300 animate-pulse-glow">
              ✨ 全员同心 +20%
            </span>
          )}
        </div>

        {/* 船员列表 */}
        <div className="space-y-2">
          {state.characters.map(char => (
            <CharacterCard
              key={char.id}
              char={char}
              selected={selectedId === char.id}
              onClick={() => setSelectedId(char.id)}
            />
          ))}
        </div>

        {/* 选中角色详情 */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{selected.avatar}</span>
            <div>
              <h3 className="text-white font-semibold">{selected.name}</h3>
              <p className="text-white/50 text-xs">{selected.combatRole}</p>
            </div>
          </div>

          <p className="text-white/50 text-xs leading-relaxed mb-4">{selected.description}</p>

          {/* 属性条 */}
          <div className="space-y-2 mb-4">
            <StatBar label="力量" value={selected.strength} color="oklch(0.58 0.26 15)" />
            <StatBar label="敏捷" value={selected.agility} color="oklch(0.65 0.22 240)" />
            <StatBar label="耐力" value={selected.endurance} color="oklch(0.65 0.18 145)" />
            <StatBar label="原力亲和" value={selected.forceAffinity} color="oklch(0.78 0.18 85)" />
          </div>

          {/* 特殊能力 */}
          <div className="glass-card-blue rounded-xl p-3 mb-3">
            <p className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1">特殊能力</p>
            <p className="text-blue-200 text-xs">{selected.specialAbility}</p>
          </div>

          {/* 装备 */}
          {equippedGear ? (
            <div className={`rounded-xl p-3 border ${
              equippedGear.rarity === 'legendary' ? 'glass-card-gold rarity-legendary' :
              equippedGear.rarity === 'elite' ? 'glass-card-blue rarity-elite' :
              'glass-card rarity-common'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{equippedGear.icon}</span>
                <div>
                  <p className={`text-xs font-semibold ${
                    equippedGear.rarity === 'legendary' ? 'text-glow-gold' :
                    equippedGear.rarity === 'elite' ? 'text-glow-blue' : 'text-white/70'
                  }`}>{equippedGear.name}</p>
                  <p className="text-white/50 text-[10px]">{equippedGear.effect}</p>
                </div>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                  equippedGear.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300' :
                  equippedGear.rarity === 'elite' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-white/10 text-white/50'
                }`}>
                  {equippedGear.rarity === 'legendary' ? '传奇' : equippedGear.rarity === 'elite' ? '精英' : '普通'}
                </span>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-white/30 text-xs">未装备任何装备</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
