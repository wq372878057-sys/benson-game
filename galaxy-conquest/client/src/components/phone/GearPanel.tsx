// ============================================================
// 手机端 - 装备·光剑工坊界面
// ============================================================
import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import type { Gear } from '../../lib/gameTypes';

const rarityConfig = {
  legendary: { label: '传奇', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', border: 'border-amber-500/30', glow: 'glow-gold' },
  elite: { label: '精英', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', border: 'border-blue-500/30', glow: 'glow-blue' },
  common: { label: '普通', badge: 'bg-white/10 text-white/50 border-white/20', border: 'border-white/10', glow: '' },
};

function GearCard({ gear }: { gear: Gear }) {
  const cfg = rarityConfig[gear.rarity];
  return (
    <div className={`glass-card rounded-xl p-3 border ${cfg.border} ${!gear.unlocked ? 'opacity-40' : ''} transition-all`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
          gear.rarity === 'legendary' ? 'bg-amber-500/10' :
          gear.rarity === 'elite' ? 'bg-blue-500/10' : 'bg-white/5'
        }`}>
          {gear.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`text-sm font-semibold truncate ${
              gear.rarity === 'legendary' ? 'text-glow-gold' :
              gear.rarity === 'elite' ? 'text-glow-blue' : 'text-white/80'
            }`}>{gear.name}</p>
            {gear.equipped && <span className="text-[9px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full flex-shrink-0">已装备</span>}
          </div>
          <p className="text-white/50 text-xs mb-1">{gear.effect}</p>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
            <span className="text-white/30 text-[10px]">{gear.holder !== '—' ? `持有：${gear.holder}` : ''}</span>
          </div>
        </div>
      </div>
      {!gear.unlocked && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-white/30">
          <span>🔒</span>
          <span>{gear.obtainMethod}</span>
        </div>
      )}
    </div>
  );
}

export default function GearPanel() {
  const { state } = useGame();
  const [filter, setFilter] = useState<'all' | 'legendary' | 'elite' | 'common'>('all');
  const [activeTab, setActiveTab] = useState<'gear' | 'ship'>('gear');

  const filtered = filter === 'all' ? state.gear : state.gear.filter(g => g.rarity === filter);

  const { ship } = state.galaxy;

  return (
    <div className="h-full flex flex-col">
      {/* Tab */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="glass-card rounded-xl p-1 flex gap-1 mb-3">
          <button
            onClick={() => setActiveTab('gear')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'gear' ? 'bg-amber-500/20 text-amber-300' : 'text-white/50'}`}
          >
            ⚔️ 装备图鉴
          </button>
          <button
            onClick={() => setActiveTab('ship')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'ship' ? 'bg-blue-500/20 text-blue-300' : 'text-white/50'}`}
          >
            🚀 飞船机库
          </button>
        </div>

        {activeTab === 'gear' && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(['all', 'legendary', 'elite', 'common'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all ${
                  filter === f
                    ? f === 'legendary' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' :
                      f === 'elite' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' :
                      f === 'common' ? 'bg-white/20 text-white/70 border border-white/30' :
                      'bg-white/20 text-white border border-white/30'
                    : 'glass-card text-white/50'
                }`}
              >
                {f === 'all' ? '全部' : f === 'legendary' ? '传奇' : f === 'elite' ? '精英' : '普通'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-4">
        {activeTab === 'gear' ? (
          <div className="space-y-2">
            {/* 统计 */}
            <div className="flex gap-3 mb-3">
              {[
                { label: '传奇', count: state.gear.filter(g => g.rarity === 'legendary' && g.unlocked).length, total: state.gear.filter(g => g.rarity === 'legendary').length, color: 'text-amber-400' },
                { label: '精英', count: state.gear.filter(g => g.rarity === 'elite' && g.unlocked).length, total: state.gear.filter(g => g.rarity === 'elite').length, color: 'text-blue-400' },
                { label: '普通', count: state.gear.filter(g => g.rarity === 'common' && g.unlocked).length, total: state.gear.filter(g => g.rarity === 'common').length, color: 'text-white/60' },
              ].map(item => (
                <div key={item.label} className="flex-1 glass-card rounded-xl p-2 text-center">
                  <p className={`font-mono-tech font-bold text-base ${item.color}`}>{item.count}/{item.total}</p>
                  <p className="text-white/40 text-[10px]">{item.label}</p>
                </div>
              ))}
            </div>
            {filtered.map(gear => <GearCard key={gear.id} gear={gear} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {/* 飞船信息 */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🚀</span>
                <div>
                  <h3 className="text-white font-orbitron font-bold">贾库拾荒者号</h3>
                  <p className="text-white/50 text-xs">改装型 YT-1300 货运飞船</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: '引擎', level: ship.engine, max: 5, icon: '⚡', effect: '步数转化效率', color: 'oklch(0.65 0.22 240)' },
                  { name: '护盾', level: ship.shield, max: 5, icon: '🛡️', effect: '战斗防御力', color: 'oklch(0.65 0.18 145)' },
                  { name: '武器系统', level: ship.weapons, max: 5, icon: '🔫', effect: '飞船战斗力', color: 'oklch(0.58 0.26 15)' },
                  { name: '超空间驱动', level: ship.hyperdrive ? 1 : 0, max: 1, icon: '🌀', effect: '跨星域飞行', color: 'oklch(0.78 0.18 85)' },
                ].map(part => (
                  <div key={part.name} className="glass-card rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{part.icon}</span>
                      <span className="text-white/80 text-xs font-medium">{part.name}</span>
                    </div>
                    <div className="flex gap-1 mb-1">
                      {Array.from({ length: part.max }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1.5 rounded-full"
                          style={{
                            background: i < part.level ? part.color : 'oklch(1 0 0 / 0.1)',
                            boxShadow: i < part.level ? `0 0 4px ${part.color}` : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-white/40 text-[10px]">{part.effect}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 升级提示 */}
            <div className="glass-card-gold rounded-xl p-3">
              <p className="text-amber-300/80 text-xs font-semibold mb-1">💡 升级提示</p>
              <p className="text-amber-200/60 text-xs">完成长距离航行任务可获得引擎升级材料。击败太空BOSS可解锁武器系统升级。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
