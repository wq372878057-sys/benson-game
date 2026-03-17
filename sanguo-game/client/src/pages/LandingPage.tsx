/**
 * 三国演义：乱世英杰录 — 落地页
 * 展示双端产品概览，引导用户进入iPhone端或Watch端体验
 * 设计风格：水墨丹青·乱世风云
 */

import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RFNZ6irBkA3J3x2UatnzHz/sanguo-hero-bg-VW3ujd3PBb5cn3wjuFY4YK.webp';
const MAP_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663379255449/RFNZ6irBkA3J3x2UatnzHz/sanguo-map-bg-D8WZSAHjzY8pDkqHuriHmz.webp';

const features = [
  { icon: '👣', title: '步数驱动行军', desc: '每 100 步 = 1 里程，10,000 步封顶 100 国力。你的每一步，都是行军的脚印。', color: 'oklch(0.45 0.1 140)' },
  { icon: '❤️', title: '心率决定指挥', desc: '心率 >150bpm 触发「临危不乱」×1.5 指挥倍率。保持冷静，方能决胜千里。', color: 'oklch(0.6 0.2 20)' },
  { icon: '🌙', title: '睡眠影响决策', desc: '深度睡眠 ≥2 小时，额外获得 30 国力「休养生息」奖励。养精蓄锐，方能运筹帷幄。', color: 'oklch(0.55 0.12 200)' },
];

const iphoneFeatures = ['🗺️ 九州沙盘 — 战略地图与国力仪表盘', '⚔️ 武将养成 — 四大核心武将属性成长', '🏹 战役系统 — 50 场历史战役时间线', '💎 宝物图鉴 — 10 件传世神兵收集', '📊 史官日志 — 数据可视化与历史复盘'];
const watchFeatures = ['⚡ 军情速报表盘 — 双环进度实时监控', '📜 军务处理 — 心率驱动的策略模式', '⚔️ 战场指挥 — 心率倍率实时战斗', '🔧 快捷指令 — 四项一键军务操作', '📈 今日国力 — 三环统计仿 Fitness'];

const warlords = [
  { name: '关羽', title: '武圣', emoji: '⚔️', specialty: '勇武冲锋', power: 98, intel: 72 },
  { name: '诸葛亮', title: '卧龙', emoji: '🪁', specialty: '运筹帷幄', power: 45, intel: 100 },
  { name: '曹操', title: '魏武', emoji: '👑', specialty: '治世能臣', power: 82, intel: 95 },
  { name: '貂蝉', title: '倾国', emoji: '🌸', specialty: '美人计', power: 35, intel: 88 },
];

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.008_270)] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[oklch(0.08_0.008_270)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[oklch(0.8_0.15_90/0.4)] bg-[oklch(0.8_0.15_90/0.1)]">
              <span className="text-[oklch(0.8_0.15_90)] text-sm font-nunito tracking-widest">v2.0 · 三足鼎立</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif-sc text-5xl md:text-7xl font-bold mb-4 leading-tight"
            style={{ color: 'oklch(0.95 0.005 90)', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            三国演义
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif-sc text-2xl md:text-4xl font-medium mb-6"
            style={{ color: 'oklch(0.8 0.15 90)', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
          >
            乱世英杰录
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[oklch(0.75_0.005_90)] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            策略驱动历史 RPG · 你的每日行动，决定天下兴衰
            <br />
            <span className="text-[oklch(0.6_0.005_90)] text-base">iPhone + Apple Watch 双端协同 · 只卖外观，不卖数值</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/iphone')}
              className="group relative px-8 py-4 rounded-lg font-serif-sc text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, oklch(0.65 0.12 90), oklch(0.8 0.15 90))', color: 'oklch(0.1 0.008 270)', boxShadow: '0 4px 20px oklch(0.8 0.15 90 / 0.4)' }}
            >
              📱 体验 iPhone 端
            </button>
            <button
              onClick={() => navigate('/watch')}
              className="group px-8 py-4 rounded-lg font-serif-sc text-lg font-semibold border transition-all duration-300 hover:scale-105"
              style={{ borderColor: 'oklch(0.8 0.15 90 / 0.4)', color: 'oklch(0.8 0.15 90)', background: 'oklch(0.8 0.15 90 / 0.08)', boxShadow: '0 4px 20px oklch(0 0 0 / 0.3)' }}
            >
              ⌚ 体验 Watch 端
            </button>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-6 h-10 rounded-full border-2 border-[oklch(0.8_0.15_90/0.4)] flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[oklch(0.8_0.15_90)] opacity-60" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-[oklch(0.95_0.005_90)] mb-4">策略即生活，生活即策略</h2>
            <div className="ink-divider max-w-xs mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                className="iron-card rounded-xl p-6 hover:border-[oklch(0.8_0.15_90/0.3)] transition-all duration-300"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-serif-sc text-xl font-semibold mb-3" style={{ color: f.color }}>{f.title}</h3>
                <p className="text-[oklch(0.65_0.005_90)] leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Device Preview */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${MAP_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.008_270)] via-transparent to-[oklch(0.08_0.008_270)]" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-[oklch(0.95_0.005_90)] mb-4">双端协同，无缝体验</h2>
            <p className="text-[oklch(0.6_0.005_90)]">iPhone 宏观策略端 · Apple Watch 即时军情端</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="gold-border-card rounded-2xl p-8 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate('/iphone')}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📱</span>
                <div>
                  <h3 className="font-serif-sc text-xl font-bold text-[oklch(0.8_0.15_90)]">iPhone 端</h3>
                  <p className="text-[oklch(0.5_0.005_90)] text-sm">宏观策略 · 历史叙事</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-[oklch(0.7_0.005_90)]">
                {iphoneFeatures.map((item, i) => <div key={i}>{item}</div>)}
              </div>
              <div className="mt-6 pt-4 border-t border-[oklch(1_0_0/0.08)]">
                <span className="text-[oklch(0.8_0.15_90)] font-semibold text-sm">点击进入体验 →</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="iron-card rounded-2xl p-8 cursor-pointer hover:scale-105 transition-transform duration-300 border border-[oklch(0.45_0.1_140/0.3)]"
              onClick={() => navigate('/watch')}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⌚</span>
                <div>
                  <h3 className="font-serif-sc text-xl font-bold text-[oklch(0.45_0.1_140)]">Apple Watch 端</h3>
                  <p className="text-[oklch(0.5_0.005_90)] text-sm">即时军情 · 微操指挥</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-[oklch(0.7_0.005_90)]">
                {watchFeatures.map((item, i) => <div key={i}>{item}</div>)}
              </div>
              <div className="mt-6 pt-4 border-t border-[oklch(1_0_0/0.08)]">
                <span className="text-[oklch(0.45_0.1_140)] font-semibold text-sm">点击进入体验 →</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warlords Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-serif-sc text-3xl md:text-4xl font-bold text-[oklch(0.95_0.005_90)] mb-4">麾下英杰</h2>
            <div className="ink-divider max-w-xs mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {warlords.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="iron-card rounded-xl p-5 text-center warlord-card"
              >
                <div className="text-4xl mb-3">{w.emoji}</div>
                <h3 className="font-serif-sc text-lg font-bold text-[oklch(0.8_0.15_90)]">{w.name}</h3>
                <p className="text-[oklch(0.5_0.005_90)] text-xs mb-3">{w.title}</p>
                <div className="text-xs text-[oklch(0.45_0.1_140)] bg-[oklch(0.45_0.1_140/0.1)] rounded px-2 py-1 mb-3">{w.specialty}</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[oklch(0.5_0.005_90)] text-xs w-6">武</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[oklch(1_0_0/0.1)]">
                      <div className="h-full rounded-full progress-crimson" style={{ width: `${w.power}%` }} />
                    </div>
                    <span className="font-nunito text-xs text-[oklch(0.7_0.005_90)]">{w.power}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[oklch(0.5_0.005_90)] text-xs w-6">智</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[oklch(1_0_0/0.1)]">
                      <div className="h-full rounded-full progress-gold" style={{ width: `${w.intel}%` }} />
                    </div>
                    <span className="font-nunito text-xs text-[oklch(0.7_0.005_90)]">{w.intel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="gold-border-card rounded-2xl p-10 text-center"
          >
            <div className="text-5xl mb-6">🏆</div>
            <h2 className="font-serif-sc text-2xl md:text-3xl font-bold text-[oklch(0.8_0.15_90)] mb-4">公平策略承诺</h2>
            <p className="text-[oklch(0.7_0.005_90)] text-lg leading-relaxed mb-8">
              只卖外观，不卖数值。所有影响战斗力的核心内容，<br />
              只能通过真实策略行为获得，不可购买。
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: '月度订阅', price: '¥30/月', desc: '专属表盘皮肤 + 月报' },
                { label: '武将皮肤', price: '¥25/套', desc: '外观升级，不影响数值' },
                { label: '三国全图', price: '¥68', desc: '完整战役地图预览' },
              ].map((item, i) => (
                <div key={i} className="iron-card rounded-lg p-4">
                  <div className="font-nunito text-xl font-bold text-[oklch(0.8_0.15_90)] mb-1">{item.price}</div>
                  <div className="font-serif-sc text-sm text-[oklch(0.7_0.005_90)] mb-1">{item.label}</div>
                  <div className="text-xs text-[oklch(0.5_0.005_90)]">{item.desc}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/iphone')}
              className="px-10 py-4 rounded-lg font-serif-sc text-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, oklch(0.65 0.12 90), oklch(0.8 0.15 90))', color: 'oklch(0.1 0.008 270)', boxShadow: '0 4px 20px oklch(0.8 0.15 90 / 0.4)' }}
            >
              立即体验 — 免费开始
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[oklch(1_0_0/0.08)]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif-sc text-[oklch(0.8_0.15_90)] text-xl font-bold mb-2">三国演义：乱世英杰录</p>
          <p className="text-[oklch(0.4_0.005_90)] text-sm">v2.0 · 三足鼎立 · 2026年3月</p>
          <p className="text-[oklch(0.3_0.005_90)] text-xs mt-4">iPhone iOS 16.0+ · Apple Watch watchOS 9.0+</p>
        </div>
      </footer>
    </div>
  );
}
