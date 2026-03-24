/**
 * iPhone端 - 江湖任务与战役
 * Design: 水墨江湖·沉浸叙事
 */

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Battle, Skill } from '@/lib/gameData';
import { toast } from 'sonner';

const BATTLE_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RUixAFWpWkwbNMtYmRxaaK/battle-scene-mYr3DUD4BiVB9CGStDpi2A.webp';

const statusConfig = {
  completed: { label: '已完成', className: 'badge-completed', icon: '✓' },
  active: { label: '进行中', className: 'badge-active', icon: '▶' },
  unlockable: { label: '可解锁', className: 'badge-unlockable', icon: '🔓' },
  locked: { label: '未解锁', className: 'badge-locked', icon: '🔒' },
};

const skillBranchColors = {
  '拳脚': '#C0392B',
  '刀枪': '#E67E22',
  '弓箭': '#27AE60',
  '谋略': '#2980B9',
};

function BattleCard({ battle, onSelect }: { battle: Battle; onSelect: (b: Battle) => void }) {
  const status = statusConfig[battle.status];
  const progressPercent = Math.min((battle.unlockProgress / battle.unlockGoal) * 100, 100);

  return (
    <button
      onClick={() => onSelect(battle)}
      className={`ink-card p-4 text-left w-full transition-all ${
        battle.status === 'active' ? 'border border-blue-500/30' : ''
      } ${battle.status === 'completed' ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{battle.enemyEmoji || '⚔️'}</span>
            <span className="font-semibold text-white text-sm" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {battle.name}
            </span>
          </div>
          <div className="text-xs text-white/40 mb-2">📍 {battle.location} · {battle.chapter}</div>
          
          {/* 解锁进度 */}
          {battle.status !== 'completed' && battle.status !== 'locked' && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>{battle.unlockCondition}</span>
                <span>{battle.unlockProgress} / {battle.unlockGoal}</span>
              </div>
              <div className="ink-progress h-1.5">
                <div className="ink-progress-bar" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {/* 奖励 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-amber-400">⚖️ +{battle.loyaltyReward} 忠义</span>
            {battle.weaponReward && <span className="text-xs text-purple-400">🗡️ 获得神兵</span>}
            {battle.unlockContent && <span className="text-xs text-green-400">🔓 {battle.unlockContent}</span>}
          </div>
        </div>
        
        <div>
          <span className={`text-xs px-2 py-1 rounded-full border ${status.className}`}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>
    </button>
  );
}

function BattleDetail({ battle, onClose }: { battle: Battle; onClose: () => void }) {
  const { completeBattle } = useGame();
  const [fighting, setFighting] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);

  const handleFight = async () => {
    if (battle.status !== 'active' && battle.status !== 'unlockable') return;
    setFighting(true);
    await new Promise(r => setTimeout(r, 2000));
    const win = Math.random() > 0.3;
    setBattleResult(win ? 'win' : 'lose');
    if (win) {
      completeBattle(battle.id, battle.loyaltyReward);
      toast.success(`${battle.name} 大获全胜！`, { description: `获得忠义 +${battle.loyaltyReward}` });
    }
    setFighting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-2xl" style={{ background: 'oklch(0.16 0.006 285)' }}>
        {/* 战役场景图 */}
        <div className="relative h-40">
          <img src={BATTLE_BG} alt={battle.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white text-xl bg-black/40 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{battle.enemyEmoji}</span>
              <h3 className="text-white font-bold text-xl" style={{ fontFamily: 'Noto Serif SC, serif' }}>{battle.name}</h3>
            </div>
            <p className="text-xs text-white/60">{battle.location} · {battle.chapter}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 叙事文本 */}
          <div className="ink-card p-3">
            <h4 className="text-xs text-amber-400 mb-2">📖 故事背景</h4>
            <p className="text-sm text-white/70 leading-relaxed">{battle.narrative}</p>
          </div>

          {/* 解锁条件 */}
          <div className="ink-card p-3">
            <h4 className="text-xs text-white/40 mb-2">解锁条件</h4>
            <div className="flex items-center gap-2">
              <span className="text-base">
                {battle.unlockType === 'steps' ? '👣' : battle.unlockType === 'sleep' ? '🌙' : battle.unlockType === 'heartRate' ? '❤️' : '🎯'}
              </span>
              <div className="flex-1">
                <div className="text-sm text-white">{battle.unlockCondition}</div>
                {battle.status !== 'completed' && (
                  <div className="mt-1">
                    <div className="ink-progress h-1.5">
                      <div className="ink-progress-bar" style={{ width: `${Math.min((battle.unlockProgress / battle.unlockGoal) * 100, 100)}%` }} />
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{battle.unlockProgress} / {battle.unlockGoal}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 通关奖励 */}
          <div className="ink-card p-3">
            <h4 className="text-xs text-white/40 mb-2">通关奖励</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span>⚖️</span>
                <span className="text-amber-400">忠义 +{battle.loyaltyReward}</span>
              </div>
              {battle.weaponReward && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🗡️</span>
                  <span className="text-purple-400">获得神兵宝物</span>
                </div>
              )}
              {battle.unlockContent && (
                <div className="flex items-center gap-2 text-sm">
                  <span>🔓</span>
                  <span className="text-green-400">{battle.unlockContent}</span>
                </div>
              )}
            </div>
          </div>

          {/* 战斗结果 */}
          {battleResult && (
            <div className={`p-4 rounded-xl text-center ${battleResult === 'win' ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
              <div className="text-3xl mb-2">{battleResult === 'win' ? '🎉' : '💀'}</div>
              <div className={`font-bold text-lg ${battleResult === 'win' ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Noto Serif SC, serif' }}>
                {battleResult === 'win' ? '大获全胜！替天行道！' : '战败撤退，再整旗鼓！'}
              </div>
              {battleResult === 'win' && (
                <div className="text-sm text-amber-400 mt-1">获得忠义 +{battle.loyaltyReward}</div>
              )}
            </div>
          )}

          {/* 战斗按钮 */}
          {(battle.status === 'active' || battle.status === 'unlockable') && !battleResult && (
            <button
              onClick={handleFight}
              disabled={fighting}
              className="hero-btn w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2"
            >
              {fighting ? (
                <>
                  <span className="animate-spin">⚔️</span>
                  <span>激战中...</span>
                </>
              ) : (
                <>
                  <span>⚔️</span>
                  <span>出兵征战</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillTree() {
  const { state } = useGame();
  const branches = ['拳脚', '刀枪', '弓箭', '谋略'] as const;

  return (
    <div className="space-y-4">
      {branches.map(branch => {
        const branchSkills = state.skills.filter(s => s.branch === branch);
        return (
          <div key={branch} className="ink-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: skillBranchColors[branch] }} />
              <h4 className="text-sm font-semibold text-white" style={{ fontFamily: 'Noto Serif SC, serif' }}>{branch}</h4>
            </div>
            <div className="space-y-2">
              {branchSkills.map(skill => (
                <div key={skill.id} className={`flex items-center gap-3 p-2 rounded-lg ${skill.unlocked ? 'bg-white/5' : 'opacity-50'}`}>
                  <span className="text-xl">{skill.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{skill.name}</span>
                      {skill.unlocked && (
                        <span className="text-xs text-amber-400">Lv.{skill.level}</span>
                      )}
                    </div>
                    <div className="text-xs text-white/40">{skill.effect}</div>
                    {!skill.unlocked && (
                      <div className="text-xs text-white/30 mt-0.5">🔒 {skill.unlockCondition}</div>
                    )}
                  </div>
                  {skill.unlocked && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-4 rounded-sm"
                          style={{
                            background: i < skill.level ? skillBranchColors[branch] : 'oklch(1 0 0 / 10%)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BattlesScreen() {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<'battles' | 'skills'>('battles');
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);

  const completedCount = state.battles.filter(b => b.status === 'completed').length;

  return (
    <div className="flex flex-col gap-3 pb-4">
      {/* 战役横幅 */}
      <div className="relative rounded-xl overflow-hidden" style={{ height: 120 }}>
        <img src={BATTLE_BG} alt="替天行道" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Serif SC, serif' }}>替天行道</h2>
              <p className="text-xs text-white/60">已历 {completedCount} 战 / 共三十六战</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">{completedCount}</div>
              <div className="text-xs text-white/60">/ 36</div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex bg-white/5 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('battles')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'battles' ? 'bg-red-900/60 text-white' : 'text-white/40'}`}
        >
          ⚔️ 战役列表
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'skills' ? 'bg-red-900/60 text-white' : 'text-white/40'}`}
        >
          🥊 十八般武艺
        </button>
      </div>

      {activeTab === 'battles' ? (
        <div className="space-y-2">
          {state.battles.map(battle => (
            <BattleCard key={battle.id} battle={battle} onSelect={setSelectedBattle} />
          ))}
        </div>
      ) : (
        <SkillTree />
      )}

      {selectedBattle && (
        <BattleDetail battle={selectedBattle} onClose={() => setSelectedBattle(null)} />
      )}
    </div>
  );
}
