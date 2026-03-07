// ============================================================
// 手机端 - 完整iPhone应用框架
// Design: 星云漂流者 | 宇宙有机主义
// ============================================================
import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import StarField from './StarField';
import GalaxyMap from './phone/GalaxyMap';
import CrewPanel from './phone/CrewPanel';
import TrialsPanel from './phone/TrialsPanel';
import GearPanel from './phone/GearPanel';
import CaptainLog from './phone/CaptainLog';

type PhoneTab = 'galaxy' | 'crew' | 'trials' | 'gear' | 'log';

const tabs: { id: PhoneTab; icon: string; label: string }[] = [
  { id: 'galaxy', icon: '🌌', label: '星图' },
  { id: 'crew', icon: '👥', label: '船员' },
  { id: 'trials', icon: '⚔️', label: '试炼' },
  { id: 'gear', icon: '🛡️', label: '装备' },
  { id: 'log', icon: '📋', label: '日志' },
];

export default function PhoneApp() {
  const [activeTab, setActiveTab] = useState<PhoneTab>('galaxy');
  const { state } = useGame();
  const { force, credits } = state;

  return (
    <div className="phone-frame relative">
      {/* 动态星空背景 */}
      <StarField />

      {/* 刘海 */}
      <div className="phone-notch" />

      {/* 状态栏 */}
      <div className="relative z-10 pt-14 px-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse-glow ${
            force.forceAlignment === 'dark' ? 'bg-red-400' : 'bg-blue-400'
          }`} />
          <span className="font-orbitron text-[11px] text-white/70 font-semibold">
            {force.forceLevelName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-[11px] text-amber-400/80">
            ✦ {credits.toLocaleString()}
          </span>
          <span className="font-mono-tech text-[11px] text-blue-400/80">
            ⚡ {force.lightSidePoints.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 flex-1 overflow-hidden" style={{ height: 'calc(100% - 120px)' }}>
        {activeTab === 'galaxy' && <GalaxyMap />}
        {activeTab === 'crew' && <CrewPanel />}
        {activeTab === 'trials' && <TrialsPanel />}
        {activeTab === 'gear' && <GearPanel />}
        {activeTab === 'log' && <CaptainLog />}
      </div>

      {/* 底部导航栏 */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div
          className="mx-3 mb-3 rounded-2xl px-2 py-2 flex items-center justify-around"
          style={{
            background: 'oklch(0.08 0.015 240 / 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid oklch(1 0 0 / 0.08)',
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 scale-105'
                  : 'hover:bg-white/5 active:scale-95'
              }`}
            >
              <span className={`text-lg transition-all ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[9px] font-medium transition-colors ${
                activeTab === tab.id ? 'text-blue-300' : 'text-white/40'
              }`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
