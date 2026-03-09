/**
 * 禅定花园 · 主页面
 * 双端模拟器展示：iPhone + Apple Watch
 * Design Philosophy: 金碧禅境 - 夜空深蓝为底，金箔色系为魂
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZenProvider } from '@/contexts/ZenContext';
import PhoneApp from '@/components/PhoneApp';
import WatchApp from '@/components/WatchApp';
import { ZEN_LEVELS, formatMerit } from '@/lib/zenStore';

type DeviceView = 'both' | 'phone' | 'watch';

// 设备框架组件
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative phone-frame" style={{ width: 320, height: 640 }}>
      {/* 刘海 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
        style={{
          width: 120,
          height: 28,
          background: '#1a1a1a',
          borderRadius: '0 0 16px 16px',
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 10, height: 10, background: '#0a0a0a' }}
        />
      </div>
      {/* 屏幕内容 */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: 10,
          left: 8,
          right: 8,
          bottom: 10,
          borderRadius: 32,
          background: '#030308',
        }}
      >
        {children}
      </div>
      {/* 侧边按钮 */}
      <div
        className="absolute right-0 rounded-r-sm"
        style={{ top: 120, width: 3, height: 50, background: '#2a2a2a' }}
      />
      <div
        className="absolute left-0 rounded-l-sm"
        style={{ top: 100, width: 3, height: 35, background: '#2a2a2a' }}
      />
      <div
        className="absolute left-0 rounded-l-sm"
        style={{ top: 145, width: 3, height: 35, background: '#2a2a2a' }}
      />
    </div>
  );
}

function WatchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ width: 180, height: 220 }}>
      {/* 表带 */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: -30,
          width: 70,
          height: 40,
          background: 'linear-gradient(180deg, #1a1a1a, #2a2a2a)',
          borderRadius: '8px 8px 0 0',
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -30,
          width: 70,
          height: 40,
          background: 'linear-gradient(0deg, #1a1a1a, #2a2a2a)',
          borderRadius: '0 0 8px 8px',
        }}
      />
      {/* 表壳 */}
      <div className="watch-frame w-full h-full relative">
        {/* 表冠 */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-sm"
          style={{
            width: 6,
            height: 30,
            background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)',
            right: -4,
          }}
        />
        {/* 屏幕 */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: 22,
            background: '#030308',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// 产品介绍区域
function ProductIntro() {
  return (
    <div className="text-center mb-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-xs font-cinzel mb-2 tracking-widest" style={{ color: '#C9A84C', opacity: 0.7 }}>
          ZEN GARDEN · 禅定花园
        </div>
        <h1 className="text-3xl font-serif-sc font-black mb-2 glow-gold">
          <span style={{ color: '#FFD700' }}>拨珠即修行</span>
          <span style={{ color: '#E8DCC8' }}> · </span>
          <span style={{ color: '#C9A84C' }}>功德化境界</span>
        </h1>
        <p className="text-sm font-serif-sc opacity-60 max-w-md mx-auto" style={{ color: '#E8DCC8' }}>
          在指尖拨动佛珠，在掌心建造净土。从破败佛斋到西方极乐世界，十个境界，一段修行之旅。
        </p>
      </motion.div>
    </div>
  );
}

// 功能亮点
function FeatureHighlights() {
  const features = [
    { icon: '📿', title: '三种珠串', desc: '菩提珠 · 琉璃珠 · 红玛瑙珠' },
    { icon: '🏯', title: '十级禅堂', desc: '从破败佛斋到西方极乐世界' },
    { icon: '⌚', title: 'Watch联动', desc: '双端实时同步，振动仪式感' },
    { icon: '🎵', title: '禅意音景', desc: '程序化合成，随境界切换' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 mb-8 max-w-2xl mx-auto w-full">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          className="zen-card rounded-2xl p-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        >
          <div className="text-2xl mb-1">{f.icon}</div>
          <div className="text-xs font-serif-sc font-bold mb-0.5" style={{ color: '#C9A84C' }}>
            {f.title}
          </div>
          <div className="text-xs font-serif-sc opacity-50" style={{ color: '#E8DCC8' }}>
            {f.desc}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const [deviceView, setDeviceView] = useState<DeviceView>('both');

  return (
    <ZenProvider>
      <div
        className="min-h-screen flex flex-col items-center"
        style={{
          background: 'radial-gradient(ellipse at top, #0F1428 0%, #030308 60%)',
          paddingBottom: '4rem',
        }}
      >
        {/* 顶部导航 */}
        <nav
          className="w-full flex justify-between items-center px-6 py-4 sticky top-0 z-50"
          style={{
            background: 'rgba(3,3,8,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(201,168,76,0.1)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🪷</span>
            <span className="text-sm font-serif-sc font-bold" style={{ color: '#C9A84C' }}>
              禅定花园
            </span>
          </div>
          <div className="flex gap-1">
            {[
              { id: 'both' as DeviceView, label: '双端' },
              { id: 'phone' as DeviceView, label: 'iPhone' },
              { id: 'watch' as DeviceView, label: 'Watch' },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setDeviceView(btn.id)}
                className="px-3 py-1 rounded-full text-xs font-serif-sc transition-all"
                style={{
                  background: deviceView === btn.id ? 'rgba(201,168,76,0.2)' : 'transparent',
                  color: deviceView === btn.id ? '#FFD700' : '#888',
                  border: `1px solid ${deviceView === btn.id ? 'rgba(201,168,76,0.4)' : 'transparent'}`,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </nav>

        {/* 主内容 */}
        <div className="flex flex-col items-center w-full pt-8">
          <ProductIntro />

          {/* 设备模拟器区域 */}
          <div className="flex flex-col items-center w-full px-4">
            <AnimatePresence mode="wait">
              {deviceView === 'both' && (
                <motion.div
                  key="both"
                  className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* iPhone 模拟器 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-xs font-cinzel opacity-50" style={{ color: '#C9A84C' }}>
                      iPhone · 禅堂场景
                    </div>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    >
                      <PhoneFrame>
                        <PhoneApp />
                      </PhoneFrame>
                    </motion.div>
                  </div>

                  {/* 连接线 */}
                  <div className="hidden lg:flex flex-col items-center gap-2">
                    <div className="text-xs font-serif-sc opacity-40" style={{ color: '#C9A84C' }}>
                      实时同步
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-px" style={{ background: 'rgba(201,168,76,0.3)' }} />
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#C9A84C' }}
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <div className="w-8 h-px" style={{ background: 'rgba(201,168,76,0.3)' }} />
                    </div>
                    <div className="text-xs font-serif-sc opacity-30" style={{ color: '#C9A84C' }}>
                      WatchConnectivity
                    </div>
                  </div>

                  {/* Apple Watch 模拟器 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-xs font-cinzel opacity-50" style={{ color: '#C9A84C' }}>
                      Apple Watch · 佛珠拨动
                    </div>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    >
                      <WatchFrame>
                        <WatchApp />
                      </WatchFrame>
                    </motion.div>
                    <div className="text-xs font-serif-sc opacity-40 text-center" style={{ color: '#E8DCC8' }}>
                      滚轮 = Digital Crown
                    </div>
                  </div>
                </motion.div>
              )}

              {deviceView === 'phone' && (
                <motion.div
                  key="phone"
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="text-xs font-cinzel opacity-50" style={{ color: '#C9A84C' }}>
                    iPhone · 完整体验
                  </div>
                  <PhoneFrame>
                    <PhoneApp />
                  </PhoneFrame>
                </motion.div>
              )}

              {deviceView === 'watch' && (
                <motion.div
                  key="watch"
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="text-xs font-cinzel opacity-50" style={{ color: '#C9A84C' }}>
                    Apple Watch · 佛珠体验
                  </div>
                  <WatchFrame>
                    <WatchApp />
                  </WatchFrame>
                  <div className="text-xs font-serif-sc opacity-40 text-center" style={{ color: '#E8DCC8' }}>
                    使用鼠标滚轮模拟 Digital Crown 旋转
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 功能亮点 */}
          <div className="mt-12 w-full">
            <div className="text-center mb-6">
              <div className="zen-divider max-w-xs mx-auto mb-4" />
              <h2 className="text-lg font-serif-sc font-black" style={{ color: '#C9A84C' }}>
                产品特色
              </h2>
            </div>
            <FeatureHighlights />
          </div>

          {/* 境界预览 */}
          <div className="mt-4 w-full max-w-2xl px-4">
            <div className="text-center mb-6">
              <div className="zen-divider max-w-xs mx-auto mb-4" />
              <h2 className="text-lg font-serif-sc font-black" style={{ color: '#C9A84C' }}>
                十级禅堂境界
              </h2>
              <p className="text-xs font-serif-sc opacity-50 mt-1" style={{ color: '#E8DCC8' }}>
                从破败佛斋到西方极乐世界
              </p>
            </div>
            <LevelPreview />
          </div>

          {/* 底部引言 */}
          <div className="mt-12 text-center px-6">
            <div className="zen-divider max-w-xs mx-auto mb-6" />
            <p className="text-sm font-serif-sc italic opacity-50" style={{ color: '#E8DCC8' }}>
              「一花一世界，一叶一菩提。」
            </p>
            <p className="text-xs font-serif-sc opacity-30 mt-2" style={{ color: '#E8DCC8' }}>
              ——《华严经》
            </p>
            <div className="mt-6 text-xs font-serif-sc opacity-20" style={{ color: '#C9A84C' }}>
              禅定花园 · Zen Garden · v1.0
            </div>
          </div>
        </div>
      </div>
    </ZenProvider>
  );
}

// 境界预览组件
function LevelPreview() {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {ZEN_LEVELS.map((level, i) => (
        <motion.div
          key={level.level}
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            border: `1px solid ${hoveredLevel === level.level ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.1)'}`,
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onMouseEnter={() => setHoveredLevel(level.level)}
          onMouseLeave={() => setHoveredLevel(null)}
        >
          <div className="flex items-center gap-3 p-3">
            <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={level.sceneImage}
                alt={level.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-cinzel" style={{ color: '#C9A84C' }}>
                  Lv.{level.level}
                </span>
                <span className="text-sm font-serif-sc font-bold" style={{ color: '#E8DCC8' }}>
                  {level.name}
                </span>
                <span className="text-xs font-serif-sc opacity-50" style={{ color: '#E8DCC8' }}>
                  {level.subtitle}
                </span>
              </div>
              <div className="text-xs font-serif-sc opacity-40 mt-0.5" style={{ color: '#E8DCC8' }}>
                {level.atmosphere}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-cinzel" style={{ color: '#C9A84C' }}>
                {level.requiredMerit === 0 ? '初始' : formatMerit(level.requiredMerit)}
              </div>
            </div>
          </div>

          {/* 悬停展开偈语 */}
          <AnimatePresence>
            {hoveredLevel === level.level && (
              <motion.div
                className="px-4 pb-3"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="zen-divider mb-2" />
                <p className="text-xs font-serif-sc italic" style={{ color: '#C9A84C' }}>
                  「{level.verse}」
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
