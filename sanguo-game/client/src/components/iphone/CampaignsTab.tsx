/**
 * 战役与计谋系统
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Campaign } from '@/lib/gameStore';
import { toast } from 'sonner';

const BATTLE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RFNZ6irBkA3J3x2UatnzHz/sanguo-battle-scene-Ro4TwZPZownU8rWGvYQ8UY.webp';

const statusConfig = {
  completed: { label: '已完成', color: 'oklch(0.45 0.1 140)', bg: 'oklch(0.45 0.1 140 / 0.15)', border: 'oklch(0.45 0.1 140 / 0.3)' },
  active: { label: '进行中', color: 'oklch(0.55 0.12 200)', bg: 'oklch(0.55 0.12 200 / 0.15)', border: 'oklch(0.55 0.12 200 / 0.4)' },
  unlockable: { label: '可解锁', color: 'oklch(0.65 0.12 90)', bg: 'oklch(0.65 0.12 90 / 0.15)', border: 'oklch(0.65 0.12 90 / 0.3)' },
  locked: { label: '未解锁', color: 'oklch(0.4 0.005 270)', bg: 'oklch(0.4 0.005 270 / 0.1)', border: 'oklch(0.4 0.005 270 / 0.2)' },
};

const TACTICS = [
  { name: '空城计', icon: '🏰', cost: 10, effect: '避战：提前得知前方是敌军还是空城', unlocked: true },
  { name: '离间计', icon: '🤝', cost: 15, effect: '策反：降低敌方武将忠诚度', unlocked: true },
  { name: '苦肉计', icon: '🤕', cost: 20, effect: '诱敌：节省战略里程消耗', unlocked: false },
  { name: '连环计', icon: '🔗', cost: 30, effect: '困敌：本日不触发敌军遭遇', unlocked: false },
  { name: '火攻计', icon: '🔥', cost: 25, effect: '奇袭：加速战役进程，国力 +50%', unlocked: false },
  { name: '借东风', icon: '🌬️', cost: 50, effect: '天时：改变战场天气，获得战术优势', unlocked: false },
];

function CampaignCard({ campaign, onSelect }: { campaign: Campaign; onSelect: () => void }) {
  const cfg = statusConfig[campaign.status];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onSelect}
      className="campaign-card rounded-xl p-4 cursor-pointer"
      style={{ background: 'oklch(0.14 0.01 270)', border: `1px solid ${cfg.border}` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: cfg.bg }}
        >
          {campaign.enemyEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-serif-sc text-sm font-bold text-[oklch(0.95_0.005_90)]">
              第 {campaign.id} 战役 · {campaign.name}
            </span>
          </div>
          <p className="text-xs text-[oklch(0.5_0.005_90)] mb-2">{campaign.location} · {campaign.era}</p>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded font-serif-sc"
              style={{ color: cfg.color, background: cfg.bg }}
            >
              {cfg.label}
            </span>
            {campaign.status !== 'locked' && campaign.status !== 'completed' && (
              <span className="text-xs text-[oklch(0.5_0.005_90)]">{campaign.unlockCondition}</span>
            )}
            {campaign.status === 'completed' && (
              <span className="text-xs text-[oklch(0.45_0.1_140)]">✓ 胜利</span>
            )}
          </div>
        </div>
        {campaign.status === 'active' && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.55_0.12_200)] pulse-gold" />
          </div>
        )}
      </div>

      {/* HP Bar for active/unlockable */}
      {(campaign.status === 'active' || campaign.status === 'unlockable') && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[oklch(0.5_0.005_90)] mb-1">
            <span>敌方 {campaign.enemy}</span>
            <span>{campaign.enemyHp} / {campaign.enemyMaxHp}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[oklch(1_0_0/0.08)]">
            <div
              className="h-full rounded-full progress-crimson"
              style={{ width: `${(campaign.enemyHp / campaign.enemyMaxHp) * 100}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function CampaignsTab() {
  const { state, dispatch } = useGame();
  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'tactics'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleUseTactic = (tactic: typeof TACTICS[0]) => {
    if (!tactic.unlocked) {
      toast.error('兵法未解锁', { description: '需完成特定战役或达到声望等级', style: { background: 'oklch(0.14 0.01 270)', color: 'oklch(0.95 0.005 90)' } });
      return;
    }
    if (state.nationalPower < tactic.cost) {
      toast.error('国力不足', { description: `需要 ${tactic.cost} 国力`, style: { background: 'oklch(0.14 0.01 270)', color: 'oklch(0.95 0.005 90)' } });
      return;
    }
    dispatch({ type: 'ADD_POWER', amount: -tactic.cost });
    toast.success(`${tactic.name} 施展成功！`, { description: tactic.effect, style: { background: 'oklch(0.14 0.01 270)', border: '1px solid oklch(0.8 0.15 90 / 0.3)', color: 'oklch(0.95 0.005 90)' } });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Battle Hero Image */}
      <div className="relative h-36 overflow-hidden">
        <img src={BATTLE_IMG} alt="战场" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[oklch(0.08_0.008_270)]" />
        <div className="absolute bottom-3 left-4">
          <h2 className="font-serif-sc text-xl font-bold text-[oklch(0.95_0.005_90)]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            乱世战役
          </h2>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex mx-4 mt-3 mb-4 rounded-lg overflow-hidden" style={{ background: 'oklch(0.14 0.01 270)' }}>
        {[{ id: 'campaigns', label: '战役列表' }, { id: 'tactics', label: '兵法技能' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as 'campaigns' | 'tactics')}
            className="flex-1 py-2.5 text-sm font-serif-sc transition-all"
            style={{
              background: activeSubTab === tab.id ? 'oklch(0.8 0.15 90)' : 'transparent',
              color: activeSubTab === tab.id ? 'oklch(0.1 0.008 270)' : 'oklch(0.5 0.005 270)',
              fontWeight: activeSubTab === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'campaigns' ? (
          <motion.div key="campaigns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 space-y-3 pb-6">
            {state.campaigns.map(c => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onSelect={() => setSelectedCampaign(selectedCampaign?.id === c.id ? null : c)}
              />
            ))}

            {/* Selected Campaign Detail */}
            <AnimatePresence>
              {selectedCampaign && (
                <motion.div
                  key={selectedCampaign.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="gold-border-card rounded-xl p-4 overflow-hidden"
                >
                  <h3 className="font-serif-sc text-base font-bold text-[oklch(0.8_0.15_90)] mb-2">
                    {selectedCampaign.name} · 战役详情
                  </h3>
                  <p className="text-[oklch(0.6_0.005_90)] text-xs leading-relaxed mb-3">{selectedCampaign.narrative}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg p-2" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
                      <p className="text-[oklch(0.5_0.005_90)] mb-0.5">解锁条件</p>
                      <p className="text-[oklch(0.7_0.005_90)]">{selectedCampaign.unlockCondition}</p>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
                      <p className="text-[oklch(0.5_0.005_90)] mb-0.5">胜利奖励</p>
                      <p className="text-[oklch(0.8_0.15_90)]">国力 +{selectedCampaign.reward.power}</p>
                    </div>
                  </div>
                  {selectedCampaign.status === 'active' && (
                    <button
                      onClick={() => {
                        dispatch({ type: 'COMPLETE_CAMPAIGN', campaignId: selectedCampaign.id });
                        toast.success(`${selectedCampaign.name} 大获全胜！`, {
                          description: `国力 +${selectedCampaign.reward.power}，疲劳清零`,
                          style: { background: 'oklch(0.14 0.01 270)', border: '1px solid oklch(0.45 0.1 140 / 0.3)', color: 'oklch(0.95 0.005 90)' },
                        });
                        setSelectedCampaign(null);
                      }}
                      className="w-full mt-3 py-2.5 rounded-lg font-serif-sc text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, oklch(0.65 0.12 90), oklch(0.8 0.15 90))', color: 'oklch(0.1 0.008 270)' }}
                    >
                      ⚔️ 发起进攻
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="tactics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pb-6">
            <p className="text-[oklch(0.5_0.005_90)] text-xs mb-4">当前国力：<span className="text-[oklch(0.8_0.15_90)] font-nunito font-bold">{state.nationalPower}</span></p>
            <div className="grid grid-cols-2 gap-3">
              {TACTICS.map((tactic, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleUseTactic(tactic)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    background: tactic.unlocked ? 'oklch(0.14 0.01 270)' : 'oklch(0.12 0.008 270)',
                    border: `1px solid ${tactic.unlocked ? 'oklch(0.8 0.15 90 / 0.2)' : 'oklch(1 0 0 / 0.06)'}`,
                    opacity: tactic.unlocked ? 1 : 0.6,
                  }}
                >
                  <div className="text-2xl mb-2">{tactic.icon}</div>
                  <div className="font-serif-sc text-sm font-bold text-[oklch(0.8_0.15_90)] mb-1">{tactic.name}</div>
                  <div className="text-xs text-[oklch(0.5_0.005_90)] mb-2 leading-relaxed">{tactic.effect}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-nunito text-xs text-[oklch(0.65_0.12_90)]">消耗 {tactic.cost} 国力</span>
                    {!tactic.unlocked && <span className="text-xs text-[oklch(0.4_0.005_270)]">🔒</span>}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
