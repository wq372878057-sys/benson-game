# 禅定花园 · 木鱼与禅堂

> 一款融合禅意美学的 Apple 双平台原生应用，支持 iPhone 与 Apple Watch 双屏联动。

![Platform](https://img.shields.io/badge/Platform-iOS%2016%2B%20%7C%20watchOS%209%2B-black)
![Swift](https://img.shields.io/badge/Swift-5.9-orange)
![SwiftUI](https://img.shields.io/badge/SwiftUI-4.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 应用简介

**禅定花园**是一款以中国传统禅宗文化为主题的冥想计数应用，灵感来源于 [禅定花园 Web 版](https://zengarden-3hrqehyk.manus.space)。用户通过拨动佛珠积累功德，解锁从「破败佛斋」到「西方极乐世界」共 10 个境界的禅堂场景，体验宁静的修行之旅。

---

## 功能特性

### iPhone 应用（iOS 16+）

| 功能模块 | 说明 |
|---------|------|
| **禅堂场景** | 实时展示当前境界的禅堂画面，含进度条与境界描述 |
| **佛珠系统** | 18 颗佛珠环形排列，支持点击、滑动拨珠，触觉反馈 |
| **三种珠串** | 菩提珠（金棕）、琉璃珠（蓝白）、红玛瑙珠（深红） |
| **快速计数** | +1、+十、+百、+千 快捷按钮 |
| **禅堂图鉴** | 10 个境界卡片，展示解锁进度与所需功德 |
| **修行统计** | 累计功德、当前境界、进度条、里程碑记录 |
| **分享成就** | 生成修行成就卡片并分享 |
| **双屏联动** | 与 Apple Watch 实时同步功德数据 |

### Apple Watch 应用（watchOS 9+）

| 功能模块 | 说明 |
|---------|------|
| **佛珠主界面** | 12 颗佛珠环绕木鱼，点击/旋转数字表冠拨珠 |
| **数字表冠支持** | 旋转表冠即可拨珠计数，符合 Watch 操作习惯 |
| **触觉反馈** | 每次拨珠触发 Watch 震动反馈 |
| **修行统计页** | 滑动切换查看功德统计与境界进度 |
| **珠串设置页** | 滑动切换选择珠串样式 |
| **iPhone 同步** | 与 iPhone 双向实时同步功德数据 |

---

## 境界系统

应用包含 10 个递进境界，随功德积累自动解锁：

| 境界 | 名称 | 所需功德 |
|------|------|---------|
| Lv.1 | 破败佛斋 | 0 |
| Lv.2 | 修缮茅屋 | 1,000 |
| Lv.3 | 石基木屋 | 5,000 |
| Lv.4 | 清雅禅院 | 20,000 |
| Lv.5 | 大殿初成 | 100,000 |
| Lv.6 | 宏伟寺庙 | 500,000 |
| Lv.7 | 琉璃净土 | 2,000,000 |
| Lv.8 | 莲池海会 | 10,000,000 |
| Lv.9 | 妙音天国 | 50,000,000 |
| Lv.10 | 西方极乐世界 | 100,000,000 |

---

## 项目结构

```
ZenGarden/
├── ZenGarden.xcodeproj/          # Xcode 项目文件
│   └── project.pbxproj
├── Shared/
│   └── Sources/
│       └── ZenModels.swift       # 共享数据模型（iOS + watchOS）
├── ZenGarden/                    # iOS 应用
│   ├── Sources/
│   │   ├── ZenGardenApp.swift    # 应用入口
│   │   ├── Views/
│   │   │   └── ContentView.swift # 主界面（含所有子视图）
│   │   └── ViewModels/
│   │       └── ZenStore.swift    # 状态管理 + WatchConnectivity
│   └── Resources/
│       └── Info.plist
└── ZenGardenWatch/               # watchOS 应用
    ├── Sources/
    │   ├── ZenGardenWatchApp.swift
    │   ├── Views/
    │   │   └── WatchContentView.swift  # Watch 主界面
    │   └── ViewModels/
    │       └── WatchStore.swift        # Watch 状态管理
    └── Resources/
        └── Info.plist
```

---

## 技术架构

本项目采用 **SwiftUI + MVVM** 架构，充分利用 Apple 原生框架：

- **SwiftUI**：声明式 UI，同时支持 iOS 和 watchOS
- **WatchConnectivity**：iPhone 与 Apple Watch 双向实时通信
- **UserDefaults**：轻量级本地数据持久化
- **UIImpactFeedbackGenerator**：iOS 触觉反馈
- **WKInterfaceDevice**：watchOS 触觉反馈
- **Digital Crown API**：Apple Watch 数字表冠交互

---

## 开发环境要求

| 工具 | 版本要求 |
|------|---------|
| Xcode | 15.0+ |
| iOS Deployment Target | 16.0+ |
| watchOS Deployment Target | 9.0+ |
| Swift | 5.9+ |
| macOS | Ventura 13.0+ |

---

## 快速开始

**第一步：克隆仓库**

```bash
git clone https://github.com/wq372878057-sys/benson-game.git
cd benson-game/ZenGarden
```

**第二步：在 Xcode 中打开项目**

```bash
open ZenGarden.xcodeproj
```

**第三步：配置 Bundle ID**

在 Xcode 中，分别为两个 Target 设置您的 Bundle ID：
- `ZenGarden`（iOS）：`com.yourname.zengarden`
- `ZenGardenWatch`（watchOS）：`com.yourname.zengarden.watch`

**第四步：配置 WatchConnectivity**

确保 iOS Target 的 `Info.plist` 中 `WKWatchKitApp` 设为 `YES`，并在 watchOS Target 的 `Info.plist` 中 `WKCompanionAppBundleIdentifier` 与 iOS Bundle ID 一致。

**第五步：运行**

选择 iPhone 模拟器或真机，点击 Run（⌘R）。如需测试 Watch 功能，需在真实设备上运行。

---

## 双屏联动说明

双屏联动功能依赖 **WatchConnectivity** 框架，需要满足以下条件：

1. iPhone 与 Apple Watch 已配对
2. 两台设备均已安装对应应用
3. 两台设备均处于活跃状态（非飞行模式）

连接成功后，Watch 上的每次拨珠操作会实时同步到 iPhone，iPhone 上的功德变化也会推送到 Watch。

---

## 色彩设计

| 颜色用途 | 色值 |
|---------|------|
| 主金色（标题、高亮） | `#D4AF37` |
| 次金色（文字） | `#F5E6C8` |
| 辅助棕色（说明文字） | `#8B7355` |
| 深色背景 | `#0D0A06` |
| 卡片背景 | `#1A0F0A` |
| 边框颜色 | `#3D2B1F` |

---

## 参考来源

本应用基于 [禅定花园 Web 版](https://zengarden-3hrqehyk.manus.space) 设计，将 Web 体验移植为原生 Apple 双平台应用。

---

*卍 修行之路，功德无量 卍*
