/**
 * iPhone 端框架组件 - 模拟 iPhone 外壳与底部导航
 * Design: 水墨江湖·沉浸叙事
 */

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import HomeScreen from './HomeScreen';
import HeroesScreen from './HeroesScreen';
import BattlesScreen from './BattlesScreen';
import WeaponsScreen from './WeaponsScreen';
import JournalScreen from './JournalScreen';

type TabId = 'home' | 'heroes' | 'battles' | 'weapons' | 'journal';

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: 'home', icon: '🏯', label: '聚义' },
  { id: 'heroes', icon: '⚔️', label: '好汉' },
  { id: 'battles', icon: '🗺️', label: '任务' },
  { id: 'weapons', icon: '🗡️', label: '兵器' },
  { id: 'journal', icon: '📜', label: '日志' },
];

const screenComponents: Record<TabId, React.ComponentType> = {
  home: HomeScreen,
  heroes: HeroesScreen,
  battles: BattlesScreen,
  weapons: WeaponsScreen,
  journal: JournalScreen,
};

export default function IPhoneFrame() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const { state } = useGame();
  const { loyaltyValue, evilValue, loyaltyLevel } = state;

  const ActiveScreen = screenComponents[activeTab];

  return (
    <div className="relative" style={{ width: 390, maxWidth: '100%' }}>
      {/* iPhone 外壳 */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #2C2C2E, #1C1C1E)',
          borderRadius: '50px',
          padding: '12px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            background: '#000',
            borderRadius: '20px',
          }}
        >
          <div className="flex items-center gap-2 px-3">
            <div className="w-3 h-3 rounded-full bg-black border border-white/10" />
            <div className="w-2 h-2 rounded-full" style={{ background: '#1A1A1A' }} />
          </div>
        </div>

        {/* 屏幕 */}
        <div
          className="relative overflow-hidden flex flex-col"
          style={{
            background: 'oklch(0.12 0.005 285)',
            borderRadius: '40px',
            height: 780,
          }}
        >
          {/* 状态栏 */}
          <div
            className="flex items-center justify-between px-6 pt-14 pb-2 flex-shrink-0"
            style={{ background: 'oklch(0.12 0.005 285)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">{loyaltyLevel}</span>
              <span className="text-xs text-white/40">·</span>
              <span className="text-xs text-white/60">{loyaltyValue.toLocaleString()} 忠义</span>
            </div>
            <div className="flex items-center gap-2">
              {evilValue > 30 && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.2)' }}>
                  <span className="text-xs text-purple-400">恶念 {evilValue}</span>
                </div>
              )}
              <span className="text-xs text-white/40">⌚</span>
            </div>
          </div>

          {/* 分隔线 */}
          <hr className="ink-divider mx-4 flex-shrink-0" />

          {/* 页面内容 */}
          <div className="flex-1 overflow-y-auto px-4 pt-3" style={{ scrollbarWidth: 'none' }}>
            <ActiveScreen />
          </div>

          {/* 底部导航 */}
          <div
            className="flex-shrink-0 flex items-center justify-around px-2 py-2 border-t border-white/8"
            style={{ background: 'oklch(0.14 0.005 285 / 95%)', backdropFilter: 'blur(20px)' }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: activeTab === tab.id ? 'oklch(0.45 0.22 22 / 20%)' : 'transparent',
                }}
              >
                <span style={{ fontSize: '20px' }}>{tab.icon}</span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: activeTab === tab.id ? 'oklch(0.65 0.22 22)' : 'rgba(255,255,255,0.35)',
                    fontFamily: 'Noto Serif SC, serif',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Home Indicator */}
          <div className="flex justify-center pb-2 flex-shrink-0">
            <div className="w-32 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>

      {/* 侧边按钮 */}
      <div
        className="absolute rounded-full"
        style={{
          right: -4,
          top: 160,
          width: 4,
          height: 60,
          background: 'linear-gradient(180deg, #3A3A3C, #2C2C2E)',
          borderRadius: '0 4px 4px 0',
        }}
      />
      <div
        className="absolute"
        style={{
          left: -4,
          top: 140,
          width: 4,
          height: 36,
          background: 'linear-gradient(180deg, #3A3A3C, #2C2C2E)',
          borderRadius: '4px 0 0 4px',
        }}
      />
      <div
        className="absolute"
        style={{
          left: -4,
          top: 190,
          width: 4,
          height: 36,
          background: 'linear-gradient(180deg, #3A3A3C, #2C2C2E)',
          borderRadius: '4px 0 0 4px',
        }}
      />
    </div>
  );
}
