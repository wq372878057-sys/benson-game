# 禅定花园 · Zen Garden

> 拨珠即修行，功德化境界。在指尖拨动佛珠，在掌心建造净土。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-iOS%2016%2B%20%7C%20watchOS%209%2B-black)](./ZenGarden/)
[![Swift](https://img.shields.io/badge/Swift-5.9-orange)](./ZenGarden/)

---

## 仓库概览

本仓库由 **Manus AI** 构建与维护，汇集了多个独立项目。每个项目均位于独立子目录中，并附有专属 `README.md` 以便查阅和维护。

| 项目名称 | 目录 | 技术栈 | 简介 |
| :--- | :--- | :--- | :--- |
| **禅定花园 · 原生应用** | [`ZenGarden/`](./ZenGarden/) | `SwiftUI` · `iOS 16+` · `watchOS 9+` | Apple 双平台原生应用，iPhone + Apple Watch 双屏联动，用于禅意冥想与计数修行。 |
| **禅定花园 · Web 原型** | [`client/`](./client/) | `React 19` · `TypeScript` · `Web Audio API` | 浏览器端交互原型，完整还原双端界面与核心交互逻辑，可直接在浏览器中体验。 |
| **生存者传说** | [`app/`](./app/) | `React Native` · `Expo` · `TypeScript` | 肉鸽（Roguelike）生存射击手游，主角自动瞄准并射击不断出现的怪物。 |
| **银河征服者** | [`galaxy-conquest/`](./galaxy-conquest/) | `React` · `TypeScript` · `Vite` | Web 端太空策略游戏，玩家管理舰队、征服星球。 |

---

## 禅定花园 · 产品简介

**禅定花园**是一款以佛教文化为核心主题的双端协同应用（iPhone + Apple Watch），通过拨动佛珠积累功德值，逐步将破败佛斋升华为西方极乐世界。本仓库同时包含：

- **Web 交互原型**（`client/` 目录，React + TypeScript）：完整还原了双端界面与核心交互逻辑，可在浏览器中预览。
- **原生 Apple 应用**（[`ZenGarden/`](./ZenGarden/) 目录，SwiftUI）：面向真实设备的 iOS + watchOS 原生实现，支持 WatchConnectivity 双屏联动。

---

## 核心功能

### 佛珠系统

三种珠串材质各具特色：**菩提珠**（初始解锁）、**琉璃珠**（1,000 功德解锁）、**红玛瑙珠**（5,000 功德解锁）。Web 版采用弹簧-阻尼物理引擎模拟真实念珠的惯性与阻力，配合俯视角透视缩放渲染，呈现近大远小的立体效果。每 18 颗一组，母珠（卍字标记）触发特殊音效。

### 功德与境界系统

共 10 级禅堂升级，从「破败佛斋」到「西方极乐世界」，每次升级触发金光爆发粒子特效与偈语展示。界面实时显示进度条与距下一境界所需功德。

### 音效系统（Web Audio API 程序化合成）

全部音效均通过 Web Audio API 程序化合成，无需外部音频文件：拨珠音效依据珠串材质差异化音色，母珠叠加泛音增强庄严感，升级音效三层叠加（低频钟声 + 高频泛音 + 短促钟鸣），背景音乐随境界切换（晨钟 → 梵唱 → 莲池 → 天籁）。

### 双端界面对照

| 功能 | iPhone | Apple Watch |
| :--- | :--- | :--- |
| 佛珠拨动 | 滑动 / 点击 | 滑动 / 点击 / Digital Crown |
| 禅堂场景 | 全屏沉浸式 | 进度环表盘 |
| 功德统计 | 详细图表 | 简洁数字 |
| 图鉴系统 | 10 境界卡片 | — |
| 振动反馈 | — | 每 100 颗触发 |
| 设置 | 音效 / 振动 | 音效 / 振动 |

---

## 境界一览

| 等级 | 名称 | 所需功德 | 氛围 |
| :--- | :--- | :--- | :--- |
| Lv.1 | 破败佛斋 | 0 | 尘埃飞舞，寂静萧索 |
| Lv.2 | 修缮茅屋 | 1,000 | 烛光摇曳，暖意渐生 |
| Lv.3 | 石基木屋 | 5,000 | 木香弥漫，经声隐隐 |
| Lv.4 | 清雅禅院 | 20,000 | 菩提树下，清风徐来 |
| Lv.5 | 大殿初成 | 100,000 | 香烟袅袅，梵音绕梁 |
| Lv.6 | 宏伟寺庙 | 500,000 | 钟声悠扬，香客如云 |
| Lv.7 | 琉璃净土 | 2,000,000 | 琉璃地面，七宝庄严 |
| Lv.8 | 莲池海会 | 10,000,000 | 莲花盛开，天乐自鸣 |
| Lv.9 | 妙音天国 | 50,000,000 | 神鸟演法，曼陀罗花雨 |
| Lv.10 | 西方极乐世界 | 100,000,000 | 无量光明，极乐庄严 |

---

## 技术架构

### Web 原型（`client/` 目录）

```
client/
├── src/
│   ├── components/
│   │   ├── BeadCanvas.tsx      # 佛珠渲染引擎（Canvas + 物理）
│   │   ├── PhoneApp.tsx        # iPhone 端完整界面
│   │   └── WatchApp.tsx        # Apple Watch 端界面
│   ├── contexts/
│   │   └── ZenContext.tsx      # 全局状态管理
│   └── lib/
│       ├── zenStore.ts         # 数据模型 + 本地存储
│       └── audioEngine.ts      # Web Audio 音效引擎
└── index.html
```

**技术栈**：React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Web Audio API · HTML5 Canvas · localStorage

### 原生 Apple 应用（`ZenGarden/` 目录）

```
ZenGarden/
├── ZenGarden.xcodeproj/            # Xcode 项目文件
├── Shared/Sources/
│   └── ZenModels.swift             # iOS + watchOS 共享数据模型
├── ZenGarden/Sources/              # iOS 应用
│   ├── ZenGardenApp.swift          # 应用入口
│   ├── Views/ContentView.swift     # 全部 iOS 界面
│   └── ViewModels/ZenStore.swift   # 状态管理 + WatchConnectivity
└── ZenGardenWatch/Sources/         # watchOS 应用
    ├── ZenGardenWatchApp.swift
    ├── Views/WatchContentView.swift
    └── ViewModels/WatchStore.swift
```

**技术栈**：SwiftUI · MVVM · WatchConnectivity · UserDefaults · Digital Crown API · UIImpactFeedbackGenerator

---

## 快速开始

### Web 原型

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 原生 Apple 应用

```bash
# 克隆仓库
git clone https://github.com/wq372878057-sys/benson-game.git

# 进入原生应用目录
cd benson-game/ZenGarden

# 用 Xcode 打开
open ZenGarden.xcodeproj
```

在 Xcode 中为 `ZenGarden`（iOS）和 `ZenGardenWatch`（watchOS）两个 Target 设置您的 Apple Developer Team 和 Bundle ID，即可编译运行。详细说明请参阅 [ZenGarden/README.md](./ZenGarden/README.md)。

---

## 操作说明

### 网页端

- **点击 / 滑动**佛珠画布拨动佛珠
- **键盘**：空格键 / → 拨珠，← 反向拨珠
- **鼠标滚轮**（Watch 区域）：模拟 Digital Crown

### 手机端（真机）

- **触摸滑动**拨动佛珠
- **上滑** Watch 界面进入统计
- **下滑**进入设置

---

## 设计美学

**金碧禅境**设计哲学以宇宙般的静谧为底色，以佛光普照的温暖为主调：

| 色彩用途 | 色值 |
| :--- | :--- |
| 底色（夜空深蓝） | `#030308` |
| 主金（金箔色） | `#C9A84C` |
| 亮金（功德圆满） | `#FFD700` |
| 玉白（经文纯净） | `#E8DCC8` |

字体选用**宋体**（庄严）搭配 **Cinzel Decorative**（神圣数字），营造东西方美学融合的禅意氛围。

---

## 维护指南

本仓库由 Manus AI 持续维护，以下是面向开发者的维护建议。

**环境要求**方面，Web 项目需要 Node.js 18+ 和 pnpm；原生 Apple 应用需要 macOS Ventura 13.0+、Xcode 15.0+、iOS 16+ / watchOS 9+ 设备或模拟器。

**依赖管理**方面，所有 JavaScript 项目均使用 `pnpm` 并附有 `pnpm-lock.yaml`，确保依赖版本一致性；Swift 项目依赖由 Xcode 直接管理。

**代码提交**方面，建议在修改前创建新分支以保持 `main` 分支整洁，提交信息请遵循规范格式，例如 `feat(ZenGarden): 添加新的佛珠样式` 或 `fix(app): 修复怪物生成逻辑错误`。

**子项目维护**方面，每个子目录均有独立的 `README.md`，如需深入了解某个项目的架构细节、API 文档或扩展方式，请直接查阅对应文件。

---

## License

MIT © 2026 Zen Garden

---

> 「一花一世界，一叶一菩提。」——《华严经》
