/**
 * 三国演义：乱世英杰录 — iPhone 端主界面
 * 底部五标签导航：沙盘 · 武将 · 战役 · 宝物 · 日志
 * 设计风格：水墨丹青·乱世风云
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/contexts/GameContext';
import SandboxTab from '@/components/iphone/SandboxTab';
import WarlordsTab from '@/components/iphone/WarlordsTab';
import CampaignsTab from '@/components/iphone/CampaignsTab';
import RelicsTab from '@/components/iphone/RelicsTab';
import LogsTab from '@/components/iphone/LogsTab';
import { PRESTIGE_LEVELS } from '@/lib/gameStore';

type TabId = 'sandbox' | 'warlords' | 'campaigns' | 'relics' | 'logs';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'sandbox', label: '沙盘', icon: '🗺️' },
  { id: 'warlords', label: '武将', icon: '⚔️' },
  { id: 'campaigns', label: '战役', icon: '🏹' },
  { id: 'relics', label: '宝物', icon: '💎' },
  { id: 'logs', label: '日志', icon: '📜' },
];

export default function IPhoneApp() {
  const [activeTab, setActiveTab] = useState<TabId>('sandbox');
  const [, navigate] = useLocation();
  const { state } = useGame();

  const prestige = PRESTIGE_LEVELS[state.prestigeLevel];
  const fatigueColor = state.fatigueValue > 80 ? 'oklch(0.6 0.2 20)' : state.fatigueValue > 50 ? 'oklch(0.65 0.15 50)' : 'oklch(0.45 0.1 140)';

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.008_270)] flex flex-col">
      {/* Status Bar */}
      <div
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'oklch(0.1 0.01 270)', borderBottom: '1px solid oklch(1 0 0 / 0.08)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="text-[oklch(0.6_0.005_90)] text-sm hover:text-[oklch(0.8_0.15_90)] transition-colors"
        >
          ← 返回
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[oklch(0.5_0.005_90)]">国力</span>
            <span className="font-nunito text-sm font-bold text-[oklch(0.8_0.15_90)]">
              {state.nationalPower.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-4 bg-[oklch(1_0_0/0.1)]" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[oklch(0.5_0.005_90)]">疲劳</span>
            <span className="font-nunito text-sm font-bold" style={{ color: fatigueColor }}>
              {state.fatigueValue}
            </span>
          </div>
          <div className="w-px h-4 bg-[oklch(1_0_0/0.1)]" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-serif-sc" style={{ color: 'oklch(0.8 0.15 90)' }}>
              {prestige.name}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/watch')}
          className="text-[oklch(0.6_0.005_90)] text-sm hover:text-[oklch(0.45_0.1_140)] transition-colors"
        >
          ⌚ Watch
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sandbox' && <SandboxTab />}
        {activeTab === 'warlords' && <WarlordsTab />}
        {activeTab === 'campaigns' && <CampaignsTab />}
        {activeTab === 'relics' && <RelicsTab />}
        {activeTab === 'logs' && <LogsTab />}
      </div>

      {/* Bottom Tab Bar */}
      <div
        className="sticky bottom-0 z-50 flex"
        style={{ background: 'oklch(0.1 0.01 270)', borderTop: '1px solid oklch(1 0 0 / 0.1)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200"
            style={{
              color: activeTab === tab.id ? 'oklch(0.8 0.15 90)' : 'oklch(0.45 0.005 270)',
            }}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-serif-sc">{tab.label}</span>
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: 'oklch(0.8 0.15 90)' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
