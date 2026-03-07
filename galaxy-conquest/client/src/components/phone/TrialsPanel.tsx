// ============================================================
// 手机端 - 银河试炼任务界面
// ============================================================
import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import type { Mission } from '../../lib/gameTypes';

const statusConfig = {
  completed: { label: '已完成', color: 'text-green-400', border: 'mission-completed', badge: 'bg-green-500/20 text-green-300' },
  active: { label: '进行中', color: 'text-blue-400', border: 'mission-active', badge: 'bg-blue-500/20 text-blue-300' },
  available: { label: '可解锁', color: 'text-amber-400', border: 'mission-available', badge: 'bg-amber-500/20 text-amber-300' },
  locked: { label: '未解锁', color: 'text-white/30', border: 'mission-locked', badge: 'bg-white/10 text-white/30' },
};

const unlockTypeIcon = {
  steps: '👣',
  sleep: '🌙',
  heartrate: '❤️',
  combined: '⚡',
  tutorial: '📖',
};

function MissionCard({ mission, onSelect }: { mission: Mission; onSelect: (m: Mission) => void }) {
  const cfg = statusConfig[mission.status];
  return (
    <button
      onClick={() => onSelect(mission)}
      className={`w-full text-left glass-card rounded-xl p-3 ${cfg.border} transition-all hover:scale-[1.01] active:scale-[0.99]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{unlockTypeIcon[mission.unlockType]}</span>
            <span className="text-white/80 text-sm font-medium truncate">{mission.name}</span>
          </div>
          <p className="text-white/40 text-xs mb-2">{mission.location} · 第 {mission.id} 关</p>
          {mission.status !== 'locked' && mission.status !== 'completed' && (
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/40">{mission.unlockCondition}</span>
                <span className="font-mono-tech text-white/60">
                  {mission.unlockProgress}/{mission.unlockTarget}
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((mission.unlockProgress / mission.unlockTarget) * 100, 100)}%`,
                    background: mission.status === 'active'
                      ? 'linear-gradient(90deg, oklch(0.65 0.22 240), oklch(0.75 0.20 240))'
                      : 'linear-gradient(90deg, oklch(0.78 0.18 85), oklch(0.88 0.16 85))',
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
          <span className="text-[10px] text-amber-400/70 font-mono-tech">+{mission.reward.forcePoints}</span>
        </div>
      </div>
    </button>
  );
}

export default function TrialsPanel() {
  const { state, startBattle } = useGame();
  const [activeTab, setActiveTab] = useState<'missions' | 'skills'>('missions');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const missions = state.missions;
  const skills = state.skills;

  return (
    <div className="h-full flex flex-col">
      {/* Tab切换 */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="glass-card rounded-xl p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'missions' ? 'bg-blue-500/20 text-blue-300' : 'text-white/50'
            }`}
          >
            银河试炼
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'skills' ? 'bg-blue-500/20 text-blue-300' : 'text-white/50'
            }`}
          >
            原力技能
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-4">
        {activeTab === 'missions' ? (
          <div className="space-y-2">
            {/* 任务统计 */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: '已完成', count: missions.filter(m => m.status === 'completed').length, color: 'text-green-400' },
                { label: '进行中', count: missions.filter(m => m.status === 'active').length, color: 'text-blue-400' },
                { label: '可解锁', count: missions.filter(m => m.status === 'available').length, color: 'text-amber-400' },
              ].map(item => (
                <div key={item.label} className="glass-card rounded-xl p-2 text-center">
                  <p className={`font-orbitron font-bold text-xl ${item.color}`}>{item.count}</p>
                  <p className="text-white/40 text-[10px]">{item.label}</p>
                </div>
              ))}
            </div>

            {missions.map(m => (
              <MissionCard key={m.id} mission={m} onSelect={setSelectedMission} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* 光明技能 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-orbitron text-glow-blue uppercase tracking-wider">光明面技能</span>
              <div className="flex-1 h-px bg-blue-500/20" />
            </div>
            {skills.filter(s => s.side === 'light').map(skill => (
              <div
                key={skill.id}
                className={`rounded-xl p-3 ${skill.unlocked ? 'glass-card-blue' : 'glass-card opacity-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{skill.name}</p>
                      {!skill.unlocked && <span className="text-[10px] text-white/30">🔒 未解锁</span>}
                    </div>
                    <p className="text-white/50 text-xs">{skill.effect}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40">消耗</p>
                    <p className="font-mono-tech text-glow-blue text-sm">{skill.cost}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* 黑暗技能 */}
            <div className="flex items-center gap-2 mt-4 mb-2">
              <span className="text-xs font-orbitron text-glow-red uppercase tracking-wider">黑暗面技能</span>
              <div className="flex-1 h-px bg-red-500/20" />
            </div>
            {skills.filter(s => s.side === 'dark').map(skill => (
              <div
                key={skill.id}
                className={`rounded-xl p-3 ${skill.unlocked ? 'glass-card-red' : 'glass-card opacity-50'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{skill.name}</p>
                      {!skill.unlocked && <span className="text-[10px] text-white/30">🔒 未解锁</span>}
                    </div>
                    <p className="text-white/50 text-xs">{skill.effect}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40">消耗</p>
                    <p className="font-mono-tech text-glow-red text-sm">{skill.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 任务详情弹窗 */}
      {selectedMission && (
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-end z-50"
          onClick={() => setSelectedMission(null)}
        >
          <div
            className="w-full glass-card rounded-t-3xl p-5 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-orbitron font-bold text-base">{selectedMission.name}</h3>
                <p className="text-white/50 text-xs">{selectedMission.location} · 第 {selectedMission.id} 关</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[selectedMission.status].badge}`}>
                {statusConfig[selectedMission.status].label}
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{selectedMission.narrative}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass-card rounded-xl p-3">
                <p className="text-white/40 text-[10px] mb-1">解锁条件</p>
                <p className="text-white/80 text-xs">{selectedMission.unlockCondition}</p>
              </div>
              <div className="glass-card rounded-xl p-3">
                <p className="text-white/40 text-[10px] mb-1">通关奖励</p>
                <p className="text-amber-300 text-xs font-mono-tech">+{selectedMission.reward.forcePoints} 原力</p>
                {selectedMission.reward.gear && <p className="text-blue-300 text-[10px]">{selectedMission.reward.gear}</p>}
                {selectedMission.reward.unlock && <p className="text-green-300 text-[10px]">解锁：{selectedMission.reward.unlock}</p>}
              </div>
            </div>
            {selectedMission.bossName && (
              <div className="glass-card-red rounded-xl p-3 mb-4">
                <p className="text-red-300/60 text-[10px] mb-1">BOSS</p>
                <p className="text-red-200 text-sm font-semibold">{selectedMission.bossName}</p>
                <p className="text-red-300/50 text-xs">HP: {selectedMission.bossMaxHp}</p>
              </div>
            )}
            {(selectedMission.status === 'active' || selectedMission.status === 'available') && (
              <button
                onClick={() => {
                  startBattle(selectedMission.id);
                  setSelectedMission(null);
                }}
                className="w-full py-3 rounded-xl font-orbitron font-semibold text-sm glow-blue bg-blue-500/20 text-blue-200 border border-blue-500/40 hover:bg-blue-500/30 transition-all active:scale-95"
              >
                ⚔️ 发起战斗
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
