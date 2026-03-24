/**
 * 水浒传：梁山风云录 - 主页面
 * Design: 水墨江湖·沉浸叙事
 * Layout: 响应式双端展示 - 左侧iPhone，右侧Apple Watch
 */

import { useState } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import IPhoneFrame from '@/components/iphone/IPhoneFrame';
import WatchSimulator from '@/components/watch/WatchSimulator';

const HERO_BANNER = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RUixAFWpWkwbNMtYmRxaaK/hero-banner-ZEkhA7PFcZuR8z2zqWU2Ub.webp';

type ViewMode = 'both' | 'iphone' | 'watch';

function AppHeader({ viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (v: ViewMode) => void }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'oklch(0.45 0.22 22 / 20%)', border: '1px solid oklch(0.45 0.22 22 / 30%)' }}>
          ⚔️
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            水浒传：梁山风云录
          </h1>
          <p className="text-xs text-white/40">运动驱动叙事 RPG · 替天行道</p>
        </div>
      </div>
      
      {/* 视图切换 */}
      <div className="flex bg-white/5 rounded-xl p-1 gap-1">
        {[
          { id: 'iphone' as const, label: '📱 iPhone' },
          { id: 'both' as const, label: '双端' },
          { id: 'watch' as const, label: '⌚ Watch' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setViewMode(v.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: viewMode === v.id ? 'oklch(0.45 0.22 22 / 40%)' : 'transparent',
              color: viewMode === v.id ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function ProductIntro() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* 英雄区 */}
      <div className="relative rounded-2xl overflow-hidden mb-8" style={{ height: 280 }}>
        <img src={HERO_BANNER} alt="梁山风云录" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded-full text-amber-400 border border-amber-400/30" style={{ background: 'rgba(243,156,18,0.1)' }}>
                运动驱动 RPG
              </span>
              <span className="text-xs px-2 py-1 rounded-full text-blue-400 border border-blue-400/30" style={{ background: 'rgba(41,128,185,0.1)' }}>
                健康游戏化
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              习武即运动，聚义即修行
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              穿越至北宋末年，通过现实运动数据驱动游戏进程。你每天走的路，是行走江湖的里程；你的心率，决定梁山战役的胜负。
            </p>
          </div>
        </div>
      </div>

      {/* 核心特性 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '👣', title: '步数驱动', desc: '每100步=1里程，行走江湖' },
          { icon: '❤️', title: '心率战斗', desc: '心率越高，攻击倍率越强' },
          { icon: '🌙', title: '睡眠养精', desc: '优质睡眠，获得忠义奖励' },
          { icon: '⚖️', title: '公平游戏', desc: '只卖外观，不卖数值' },
        ].map(feat => (
          <div key={feat.title} className="ink-card p-4 text-center">
            <div className="text-2xl mb-2">{feat.icon}</div>
            <div className="text-sm font-semibold text-white mb-1" style={{ fontFamily: 'Noto Serif SC, serif' }}>{feat.title}</div>
            <div className="text-xs text-white/40">{feat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [showIntro, setShowIntro] = useState(true);

  return (
    <GameProvider>
      <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
        {/* 背景纹理 */}
        <div
          className="fixed inset-0 pointer-events-none opacity-3"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.45 0.22 22 / 15%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.78 0.12 75 / 10%) 0%, transparent 50%)`,
          }}
        />

        <AppHeader viewMode={viewMode} setViewMode={setViewMode} />

        {/* 产品介绍切换 */}
        <div className="flex justify-center py-3 border-b border-white/5">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setShowIntro(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: showIntro ? 'oklch(0.22 0.008 285)' : 'transparent',
                color: showIntro ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            >
              产品介绍
            </button>
            <button
              onClick={() => setShowIntro(false)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: !showIntro ? 'oklch(0.22 0.008 285)' : 'transparent',
                color: !showIntro ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            >
              交互演示
            </button>
          </div>
        </div>

        {showIntro ? (
          <ProductIntro />
        ) : (
          /* 设备展示区 */
          <main className="flex flex-col items-center py-8 px-4">
            {/* 双端展示 */}
            {viewMode === 'both' && (
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full max-w-5xl">
                {/* iPhone */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📱</span>
                    <span className="text-sm font-semibold text-white/60">iPhone 端</span>
                    <span className="text-xs text-white/30">iOS 16.0+</span>
                  </div>
                  <IPhoneFrame />
                </div>

                {/* 分隔线 */}
                <div className="hidden lg:flex flex-col items-center gap-4">
                  <div className="h-40 w-px bg-white/10" />
                  <div className="text-white/20 text-xs text-center">双端<br/>协同</div>
                  <div className="h-40 w-px bg-white/10" />
                </div>

                {/* Watch */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⌚</span>
                    <span className="text-sm font-semibold text-white/60">Apple Watch 端</span>
                    <span className="text-xs text-white/30">watchOS 9.0+</span>
                  </div>
                  <WatchSimulator />
                </div>
              </div>
            )}

            {viewMode === 'iphone' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📱</span>
                  <span className="text-sm font-semibold text-white/60">iPhone 端 · iOS 16.0+</span>
                </div>
                <IPhoneFrame />
              </div>
            )}

            {viewMode === 'watch' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⌚</span>
                  <span className="text-sm font-semibold text-white/60">Apple Watch 端 · watchOS 9.0+</span>
                </div>
                <WatchSimulator />
                <div className="mt-4 ink-card p-4 max-w-xs text-center">
                  <p className="text-xs text-white/50 leading-relaxed">
                    点击表盘底部图标切换屏幕。<br/>
                    Digital Crown（右上按钮）→ 今日统计<br/>
                    侧边按钮（右下按钮）→ 快捷操作
                  </p>
                </div>
              </div>
            )}

            {/* 功能说明 */}
            <div className="mt-12 max-w-2xl w-full">
              <h3 className="text-center text-white/40 text-sm mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                — 核心功能一览 —
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    platform: '📱 iPhone 端',
                    features: [
                      '聚义厅主界面 · 健康数据仪表盘',
                      '好汉招募与管理 · 四大核心好汉',
                      '替天行道战役 · 36战主线叙事',
                      '兵器谱 · 10件神兵宝物图鉴',
                      '替天行道日志 · 数据可视化复盘',
                    ],
                  },
                  {
                    platform: '⌚ Apple Watch 端',
                    features: [
                      '聚义进度表盘 · 双环实时进度',
                      '习武运动模式 · 心率区间监测',
                      '梁山战役模式 · 心率驱动战斗',
                      '快捷操作面板 · 饮酒/赏金/悔过',
                      '今日功课统计 · 三环活动数据',
                    ],
                  },
                ].map(section => (
                  <div key={section.platform} className="ink-card p-4">
                    <h4 className="text-sm font-semibold text-white mb-3">{section.platform}</h4>
                    <ul className="space-y-1.5">
                      {section.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                          <span className="text-amber-400 mt-0.5 flex-shrink-0">·</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* 底部 */}
        <footer className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-white/20">水浒传：梁山风云录 v1.0.0 · 运动驱动叙事 RPG</p>
          <p className="text-xs text-white/15 mt-1">只卖外观，不卖数值 · 公平游戏承诺</p>
        </footer>
      </div>
    </GameProvider>
  );
}
