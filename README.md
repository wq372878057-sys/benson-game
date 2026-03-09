# Manus AI 作品集：wq372878057-sys

欢迎来到由 **Manus AI** 为您构建的专属代码仓库。本仓库汇集了多个独立项目，涵盖了从原生移动应用到 Web 游戏等不同领域，旨在全面展示 Manus AI 的开发与交付能力。

---

## 项目总览

本仓库目前包含以下主要项目，每个项目均位于独立的子目录中，并附有专属的 `README.md` 以便查阅和维护。

| 项目名称 | 目录 | 技术栈 | 简介 |
| :--- | :--- | :--- | :--- |
| **禅定花园 (Zen Garden)** | [`ZenGarden/`](./ZenGarden/) | `SwiftUI` `watchOS` `iOS` | 一款 Apple 双平台原生应用，含 iPhone 与 Apple Watch 双屏联动功能，用于禅意冥想与计数。 |
| **生存者传说 (Survivor Legend)** | [`app/`](./app/) | `React Native` `Expo` `TypeScript` | 一款肉鸽（Roguelike）生存风格的射击手游，主角自动瞄准并射击不断出现的怪物。 |
| **星球大战：银河征服者** | [`galaxy-conquest/`](./galaxy-conquest/) | `React` `TypeScript` `Vite` | 一款 Web 端太空策略游戏，玩家可以管理舰队、征服星球。 |

---

## 维护与使用指南

### 1. 导航项目

- 每个项目都是独立的，您可以直接进入对应目录进行查看和开发。
- 建议首先阅读每个项目内部的 `README.md` 文件，以快速了解其具体功能、技术架构和启动方式。

### 2. 环境要求

- **原生 Apple 应用** (`ZenGarden`)：需要 macOS 环境及 Xcode 15.0+。详细要求请参阅 [ZenGarden/README.md](./ZenGarden/README.md)。
- **React Native 应用** (`app/`)：需要 Node.js、pnpm/npm/yarn 及 Expo Go 客户端。请遵循标准的 React Native 开发环境配置。
- **Web 应用** (`galaxy-conquest/`)：需要 Node.js 和 pnpm/npm/yarn。通过 `pnpm install` 和 `pnpm dev` 即可在本地启动。

### 3. 依赖管理

- 所有 JavaScript 项目均使用 `pnpm` 作为首选包管理器，并已包含 `pnpm-lock.yaml` 文件以确保依赖版本一致性。
- Swift 项目的依赖由 Xcode 直接管理。

### 4. 代码提交

- 建议在修改代码前创建新的分支，以保持 `main` 分支的整洁。
- 提交代码时，请遵循清晰、规范的提交信息格式，例如 `feat(ZenGarden): 添加新的佛珠样式` 或 `fix(app): 修复怪物生成逻辑错误`。

---

> 本仓库由 Manus AI 自动生成和维护。如果您有任何疑问或需要进一步的协助，请随时提出。
