# 星球大战：银河征服者 🚀

> **Star Wars: Galaxy Conquest** — 一款以运动数据为驱动核心的叙事 RPG 网页应用，灵感来源于《大圣归来：九九八十一难》玩法框架，移植到星球大战宇宙观。

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)](https://vitejs.dev/)

---

## 目录

- [游戏背景](#游戏背景)
- [核心玩法设计](#核心玩法设计)
- [技术架构](#技术架构)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [界面说明](#界面说明)
- [游戏系统详解](#游戏系统详解)
- [数据类型参考](#数据类型参考)
- [开发指南](#开发指南)
- [后续规划](#后续规划)

---

## 游戏背景

你出生在**贾库废墟星球**，没有任何背景和权利。从一艘破旧飞船残骸出发，通过真实的运动数据（步数、心率、睡眠）驱动角色成长，最终征服整个银河系。

**核心叙事弧线：** 废墟拾荒者 → 原力感知者 → 绝地武士 → 银河征服者

---

## 核心玩法设计

### 运动驱动机制

| 运动行为 | 游戏转化 | 说明 |
|---------|---------|------|
| 每 100 步 | 1 光年 | 推进银河旅程 |
| 每 1000 步 | 10 原力点 | 提升原力等级 |
| 心率 ≥ 180bpm | 攻击倍率 ×1.5 | 极限训练触发爆发 |
| 深度睡眠 ≥ 2h | +30 原力点/天 | 冥想恢复加成 |
| 连续 7 天 | +20 原力点/天 | 连击奖励 |

### 双路线原力系统

```
光明原力 ←→ 黑暗原力
  冥想/步数         极限心率/黑暗技能
  绝地大师          西斯尊主
  隐藏结局：平衡之道（两者均衡）
```

### 81 关银河试炼

任务解锁条件与真实运动挂钩：
- **步数型**：累计光年达到阈值
- **心率型**：完成高心率区间训练
- **睡眠型**：连续高质量睡眠
- **综合型**：多维度运动指标组合

---

## 技术架构

```
前端框架:  React 19 + TypeScript 5.6
样式系统:  Tailwind CSS 4 + 自定义 CSS 变量（OKLCH 色彩空间）
路由:      Wouter 3
状态管理:  React Context + useReducer（GameContext）
动画:      Framer Motion + CSS 自定义动画
图表:      Recharts 2
构建工具:  Vite 7
字体:      Orbitron（标题）+ Share Tech Mono（数据）+ Noto Sans SC（正文）
```

### 设计哲学：星云漂流者（Nebula Drifter）

- **色彩**：深空黑底 `oklch(0.08 0.015 250)` + 蓝色原力光晕 + 金色信用点
- **字体**：Orbitron（科幻感标题）配 Share Tech Mono（数据显示）
- **质感**：毛玻璃卡片（`backdrop-blur`）+ 粒子星空背景
- **动画**：光晕脉冲、星空粒子漂浮、进度条流光

---

## 项目结构

```
galaxy-conquest/
├── client/
│   ├── index.html                    # 入口 HTML（含 Google Fonts）
│   └── src/
│       ├── main.tsx                  # React 入口
│       ├── App.tsx                   # 路由 + 主题配置
│       ├── index.css                 # 全局样式 + CSS 变量 + 自定义动画
│       │
│       ├── lib/
│       │   ├── gameTypes.ts          # 所有 TypeScript 类型定义
│       │   ├── gameEngine.ts         # 游戏引擎（计算函数 + 初始数据）
│       │   └── utils.ts              # 通用工具函数
│       │
│       ├── contexts/
│       │   ├── GameContext.tsx       # 游戏状态管理（Context + Reducer）
│       │   └── ThemeContext.tsx      # 主题切换
│       │
│       ├── components/
│       │   ├── StarField.tsx         # 星空粒子背景
│       │   ├── RingProgress.tsx      # SVG 环形进度条
│       │   ├── PhoneApp.tsx          # 手机端框架（底部导航 + 页面切换）
│       │   ├── WatchApp.tsx          # 手表端框架（五大界面）
│       │   │
│       │   ├── phone/
│       │   │   ├── GalaxyMap.tsx     # 📱 星图主界面（步数/光年/任务进度）
│       │   │   ├── CrewPanel.tsx     # 📱 船员管理（四大角色 + 状态）
│       │   │   ├── TrialsPanel.tsx   # 📱 银河试炼（81关任务列表）
│       │   │   ├── GearPanel.tsx     # 📱 装备图鉴（传奇/精英/普通）
│       │   │   └── CaptainLog.tsx    # 📱 舰长日志（7日数据 + 原力技能树）
│       │   │
│       │   └── ui/                   # shadcn/ui 基础组件库
│       │
│       └── pages/
│           ├── Home.tsx              # 主页（手机+手表+信息面板布局）
│           └── NotFound.tsx          # 404 页面
│
├── server/
│   └── index.ts                      # Express 静态文件服务器
│
├── shared/
│   └── const.ts                      # 共享常量
│
├── ideas.md                          # 设计构思文档（三种风格方案）
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm ≥ 8

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/wq372878057-sys/benson-game.git
cd benson-game

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:3000

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

### 环境变量

开发环境无需配置额外环境变量，所有数据为本地模拟数据。

生产部署时可配置：

```env
VITE_ANALYTICS_ENDPOINT=   # 统计服务端点（可选）
VITE_ANALYTICS_WEBSITE_ID= # 统计网站ID（可选）
```

---

## 界面说明

### 📱 手机端（iPhone）

| 界面 | 组件 | 核心功能 |
|------|------|---------|
| 🌌 星图 | `GalaxyMap.tsx` | 今日步数/光年、阶段进度、当前任务、心率/睡眠/卡路里 |
| 👥 船员 | `CrewPanel.tsx` | 四大角色（拾荒者/R7/绝地武士/曼达洛猎人）属性与状态 |
| ⚔️ 试炼 | `TrialsPanel.tsx` | 81关任务列表、解锁条件、进度追踪、战斗触发 |
| 🎒 装备 | `GearPanel.tsx` | 传奇/精英/普通三级装备图鉴、解锁状态 |
| 📖 日志 | `CaptainLog.tsx` | 7日运动数据图表、原力技能树（光明/黑暗双线） |

### ⌚ 手表端（Apple Watch）

| 界面 | 功能 |
|------|------|
| 🕐 表盘 | 实时时间、步数/原力/当关数据、环形进度 |
| 🏃 训练 | 四种训练模式（光剑/耐力/冥想/突袭）、实时心率、计时 |
| ⚔️ 战斗 | 实时心率驱动战斗、BOSS血条、攻击倍率显示 |
| ⚡ 快捷 | 原力技能快速释放、黑暗侵蚀警告 |
| 📊 统计 | 7日步数趋势、睡眠质量、综合评分 |

### 🖥️ 中间信息面板

实时展示核心游戏数据：原力等级、光明/黑暗原力值、银河信用点、总航行光年、连续训练天数、今日四项训练数据。

---

## 游戏系统详解

### 原力等级体系

```typescript
// 七级原力等级（lightSidePoints 驱动）
Lv.1  原力感知者   0 - 1,000 点
Lv.2  学徒         1,001 - 5,000 点
Lv.3  武士         5,001 - 15,000 点
Lv.4  骑士         15,001 - 30,000 点
Lv.5  大师         30,001 - 50,000 点
Lv.6  议会成员     50,001 - 80,000 点
Lv.7  大绝地       80,001+ 点
```

### 黑暗面侵蚀机制

- 黑暗原力值范围：0 - 100
- 极限心率训练（≥180bpm）：+5 黑暗点/次
- 使用黑暗技能：+10~20 黑暗点
- 冥想/深度睡眠：-5 黑暗点/次
- 黑暗值 ≥ 80：触发「堕落警告」，结局路线切换

### 战斗系统

```
攻击倍率 = f(心率)
  心率 < 130bpm  → ×1.0（基础）
  130 ≤ 心率 < 160 → ×1.2（有氧区间）
  心率 ≥ 160bpm  → ×1.5（极限区间，同时积累黑暗原力）

玩家伤害 = 基础攻击 × 攻击倍率 × 装备加成
BOSS伤害 = BOSS攻击力（固定）
```

### 四大船员角色

| 角色 | 专长 | 解锁条件 | 特殊能力 |
|------|------|---------|---------|
| 拾荒者（玩家） | 全能适应 | 初始 | 原力感知 |
| 机器人 R7 | 耐力/导航 | 初始 | 精准导航 |
| 流亡绝地武士 | 精神力/冥想 | 第5关 | 深度冥想 |
| 曼达洛猎人 | 爆发力/精准 | 第18关 | 精准射击 |

---

## 数据类型参考

核心类型定义见 `client/src/lib/gameTypes.ts`：

```typescript
GameState          // 完整游戏状态
ForceState         // 原力系统状态
Character          // 角色数据
Gear               // 装备数据
Mission            // 任务数据
Skill              // 技能数据
TrainingSession    // 训练会话
BattleState        // 战斗状态
DailyData          // 每日运动数据
GalaxyState        // 银河进度状态
TodayData          // 今日数据快照
```

游戏引擎核心函数见 `client/src/lib/gameEngine.ts`：

```typescript
getForceLevel(points)           // 根据原力点数获取等级信息
getHeartRateZone(bpm)           // 获取心率区间
getAttackMultiplier(bpm)        // 获取战斗攻击倍率
calcDailyForce(steps, sleep...) // 计算每日原力收益
getForceAlignment(light, dark)  // 计算原力倾向
createInitialGameState()        // 生成初始游戏状态
```

---

## 开发指南

### 添加新任务

在 `gameEngine.ts` 的 `initialMissions` 数组中添加：

```typescript
{
  id: 90,                           // 唯一任务ID（1-81为主线）
  name: '任务名称',
  location: '星球名',
  sector: '星域名',
  narrative: '任务叙事文本',
  status: 'locked',                 // locked | available | active | completed
  unlockType: 'steps',              // steps | sleep | heartrate | combined | tutorial
  unlockCondition: '解锁条件描述',
  unlockProgress: 0,
  unlockTarget: 10000,
  reward: { forcePoints: 200, gear: '装备名', unlock: '解锁内容' },
  bossName: 'BOSS名称',
  bossHp: 300,
  bossMaxHp: 300,
}
```

### 添加新装备

在 `gameEngine.ts` 的 `initialGear` 数组中添加：

```typescript
{
  id: 'unique-gear-id',
  name: '装备名称',
  rarity: 'legendary',              // legendary | elite | common
  effect: '效果描述',
  holder: '持有者',
  obtainMethod: '获取方式',
  icon: '🔮',                       // Emoji 图标
  equipped: false,
  unlocked: false,
}
```

### 添加新技能

在 `gameEngine.ts` 的 `initialSkills` 数组中添加：

```typescript
{
  id: 'skill-id',
  name: '技能名称',
  side: 'light',                    // light | dark
  cost: 30,                         // 原力点消耗
  effect: '技能效果描述',
  unlocked: false,
  icon: '✨',
  unlockCondition: '解锁条件',
}
```

### 扩展游戏状态

1. 在 `gameTypes.ts` 中添加新的类型字段
2. 在 `gameEngine.ts` 的 `createInitialGameState()` 中初始化
3. 在 `GameContext.tsx` 的 `reducer` 中添加对应 `Action` 处理

### 样式规范

项目使用自定义 CSS 类（定义在 `index.css`）：

```css
.glass-card          /* 毛玻璃卡片背景 */
.glass-card-blue     /* 蓝色发光毛玻璃 */
.glass-card-red      /* 红色发光毛玻璃 */
.starfield-bg        /* 深空背景渐变 */
.text-glow-blue      /* 蓝色文字光晕 */
.text-glow-gold      /* 金色文字光晕 */
.text-glow-red       /* 红色文字光晕 */
.force-bar           /* 原力进度条渐变 */
.dark-bar            /* 黑暗面进度条渐变 */
.glow-blue           /* 蓝色阴影发光 */
.font-orbitron       /* Orbitron 科幻字体 */
.font-mono-tech      /* Share Tech Mono 数据字体 */
```

---

## 后续规划

### 近期（v1.1）

- [ ] **接入 Apple HealthKit**：读取真实步数、心率、睡眠数据替代模拟数据
- [ ] **接入 Google Fit API**：Android 端健康数据支持
- [ ] **每日推送通知**：训练提醒、任务解锁、连击断签预警
- [ ] **可交互银河星图**：SVG 星域地图，点击星球查看任务详情

### 中期（v1.2）

- [ ] **多人联机**：好友间步数 PK、公会战
- [ ] **赛季系统**：每月重置排行榜，发放专属装备
- [ ] **AR 功能**：通过摄像头扫描环境触发隐藏任务
- [ ] **音效系统**：星球大战主题 BGM + 战斗音效

### 长期（v2.0）

- [ ] **原生 iOS/Android App**：React Native 移植
- [ ] **Apple Watch 原生应用**：watchOS 原生开发
- [ ] **AI 叙事引擎**：根据运动数据动态生成个性化剧情
- [ ] **NFT 装备系统**：稀有装备链上确权

---

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: 添加新功能'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### Commit 规范

```
feat:     新功能
fix:      Bug 修复
style:    样式调整
refactor: 代码重构
docs:     文档更新
chore:    构建/工具链调整
```

---

## 许可证

MIT License © 2026 Benson

---

> *"愿原力与你同在。"* — 欧比旺·克诺比
