/**
 * iPhone端 - 好汉招募与管理
 * Design: 水墨江湖·沉浸叙事
 */

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hero, INITIAL_WEAPONS } from '@/lib/gameData';
import { toast } from 'sonner';

const HEROES_BANNER = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RUixAFWpWkwbNMtYmRxaaK/heroes-banner-FHTpaN3TMeNM8XuiRDQgdA.webp';

const moraleConfig = {
  '高昂': { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30', icon: '⬆️' },
  '平静': { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: '➡️' },
  '低落': { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: '⬇️' },
  '动摇': { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: '❗' },
};

function StatBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 w-8">{label}</span>
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-xs text-white/60 w-6 text-right">{value}</span>
    </div>
  );
}

function HeroCard({ hero, onSelect }: { hero: Hero; onSelect: (h: Hero) => void }) {
  const morale = moraleConfig[hero.morale];
  const hpPercent = (hero.hp / hero.maxHp) * 100;
  const equippedWeapon = INITIAL_WEAPONS.find(w => w.id === hero.equippedWeapon);

  return (
    <button
      onClick={() => onSelect(hero)}
      className="ink-card p-4 text-left w-full hover:border-white/20 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* 头像 */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-white/10"
          style={{ background: `${hero.color}20` }}
        >
          {hero.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white" style={{ fontFamily: 'Noto Serif SC, serif' }}>{hero.name}</span>
            <span className="text-xs text-white/40">「{hero.title}」</span>
            <span className="text-xs text-amber-400 ml-auto">Lv.{hero.level}</span>
          </div>
          
          {/* 士气 */}
          <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-2 ${morale.bg}`}>
            <span>{morale.icon}</span>
            <span className={morale.color}>士气{hero.morale}</span>
          </div>
          
          {/* HP */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>生命</span>
              <span>{hero.hp} / {hero.maxHp}</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${hpPercent}%`,
                  background: hpPercent > 60 ? 'linear-gradient(90deg, #27AE60, #2ECC71)' : hpPercent > 30 ? 'linear-gradient(90deg, #F39C12, #E67E22)' : 'linear-gradient(90deg, #C0392B, #E74C3C)',
                }}
              />
            </div>
          </div>

          {/* 装备 */}
          {equippedWeapon && (
            <div className="flex items-center gap-1 text-xs text-amber-400/70">
              <span>{equippedWeapon.emoji}</span>
              <span>{equippedWeapon.name}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function HeroDetail({ hero, onClose }: { hero: Hero; onClose: () => void }) {
  const { state, dispatch } = useGame();
  const morale = moraleConfig[hero.morale];
  const obtainedWeapons = state.weapons.filter(w => w.obtained);

  const handleEquip = (weaponId: string) => {
    dispatch({ type: 'EQUIP_WEAPON', heroId: hero.id, weaponId });
    toast.success('装备成功', { description: `已为${hero.name}装备${state.weapons.find(w => w.id === weaponId)?.name}` });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl" style={{ background: 'oklch(0.16 0.006 285)' }}>
        {/* 头部 */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10" style={{ background: 'oklch(0.16 0.006 285)' }}>
          <h3 className="font-bold text-white" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            {hero.name}·{hero.title}
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 角色信息 */}
          <div className="flex gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-white/10"
              style={{ background: `${hero.color}20` }}
            >
              {hero.emoji}
            </div>
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border mb-2 ${morale.bg}`}>
                <span>{morale.icon}</span>
                <span className={morale.color}>士气{hero.morale}</span>
              </div>
              <div className="text-xs text-white/60 leading-relaxed">{hero.description}</div>
            </div>
          </div>

          {/* 属性 */}
          <div className="ink-card p-3 space-y-2">
            <h4 className="text-xs text-white/40 mb-2">核心属性</h4>
            <StatBar label="力量" value={hero.strength} color="#C0392B" />
            <StatBar label="敏捷" value={hero.agility} color="#2980B9" />
            <StatBar label="体魄" value={hero.physique} color="#27AE60" />
            <StatBar label="智谋" value={hero.strategy} color="#F39C12" />
          </div>

          {/* 运动特长 */}
          <div className="ink-card p-3">
            <h4 className="text-xs text-white/40 mb-2">运动特长</h4>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏃</span>
              <div>
                <div className="text-sm font-semibold text-white">{hero.sportSpecialty}</div>
                <div className="text-xs text-white/40">{hero.sportType}</div>
              </div>
            </div>
          </div>

          {/* 装备 */}
          <div className="ink-card p-3">
            <h4 className="text-xs text-white/40 mb-3">装备兵器</h4>
            <div className="space-y-2">
              {obtainedWeapons.map(weapon => (
                <button
                  key={weapon.id}
                  onClick={() => handleEquip(weapon.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all ${
                    hero.equippedWeapon === weapon.id
                      ? 'border-amber-400/50 bg-amber-400/10'
                      : 'border-white/8 bg-white/3 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{weapon.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm text-white">{weapon.name}</div>
                    <div className="text-xs text-white/40">{weapon.effect}</div>
                  </div>
                  {hero.equippedWeapon === weapon.id && (
                    <span className="text-xs text-amber-400">已装备</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroesScreen() {
  const { state } = useGame();
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  const allHighMorale = state.heroes.filter(h => h.morale === '高昂' || h.morale === '平静').length === state.heroes.length;

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* 英雄横幅 */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 140 }}>
        <img src={HEROES_BANNER} alt="梁山好汉" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Serif SC, serif' }}>梁山好汉</h2>
          <p className="text-xs text-white/60">已招募 {state.heroes.filter(h => h.unlocked).length} / 108 位好汉</p>
        </div>
      </div>

      {/* 兄弟同心加成 */}
      {allHighMorale && (
        <div className="ink-card p-3 border border-amber-400/30 bg-amber-400/5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤝</span>
            <div>
              <div className="text-sm font-semibold text-amber-400">兄弟同心</div>
              <div className="text-xs text-white/60">全员士气高昂，今日忠义值 +20% 奖励</div>
            </div>
          </div>
        </div>
      )}

      {/* 好汉列表 */}
      <div className="space-y-3">
        {state.heroes.filter(h => h.unlocked).map(hero => (
          <HeroCard key={hero.id} hero={hero} onSelect={setSelectedHero} />
        ))}
      </div>

      {/* 待解锁好汉 */}
      <div className="ink-card p-4">
        <h3 className="text-sm font-semibold text-white/60 mb-3" style={{ fontFamily: 'Noto Serif SC, serif' }}>待招募好汉</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: '武松', title: '行者', emoji: '🐯', condition: '义薄云天境界解锁', locked: true },
            { name: '林冲', title: '豹子头', emoji: '🐆', condition: '义薄云天境界解锁', locked: true },
            { name: '时迁', title: '鼓上蚤', emoji: '🐭', condition: '小有名气境界解锁', locked: state.loyaltyLevel === '初入江湖' },
            { name: '白胜', title: '白日鼠', emoji: '🐀', condition: '小有名气境界解锁', locked: state.loyaltyLevel === '初入江湖' },
          ].map(hero => (
            <div key={hero.name} className={`p-3 rounded-lg border ${hero.locked ? 'border-white/8 opacity-50' : 'border-amber-400/30 bg-amber-400/5'}`}>
              <div className="text-2xl mb-1">{hero.emoji}</div>
              <div className="text-sm font-semibold text-white">{hero.name}</div>
              <div className="text-xs text-white/40">「{hero.title}」</div>
              <div className="text-xs text-white/30 mt-1">{hero.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedHero && (
        <HeroDetail hero={selectedHero} onClose={() => setSelectedHero(null)} />
      )}
    </div>
  );
}
