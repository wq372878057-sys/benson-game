// ContentView.swift
// 禅定花园 - iOS 主界面

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: ZenStore
    @State private var activeTab: Tab = .temple

    enum Tab {
        case temple, beads
    }

    var body: some View {
        ZStack {
            // 深色背景
            Color.black.ignoresSafeArea()

            VStack(spacing: 0) {
                // 顶部状态栏
                HeaderView()
                    .padding(.top, 8)

                // 功能按钮栏
                ActionButtonsView()
                    .padding(.vertical, 8)

                // 主内容区
                TabView(selection: $activeTab) {
                    TempleView()
                        .tag(Tab.temple)

                    BeadsView()
                        .tag(Tab.beads)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                // 底部标签栏
                BottomTabBar(activeTab: $activeTab)
            }
        }
        .sheet(isPresented: $store.showTempleGallery) {
            TempleGalleryView()
                .environmentObject(store)
        }
        .sheet(isPresented: $store.showStats) {
            StatsView()
                .environmentObject(store)
        }
        .sheet(isPresented: $store.showDualScreen) {
            DualScreenInfoView()
                .environmentObject(store)
        }
    }
}

// MARK: - 顶部状态栏
struct HeaderView: View {
    @EnvironmentObject var store: ZenStore

    var body: some View {
        VStack(spacing: 4) {
            // 标题
            HStack(spacing: 8) {
                Text("☸")
                    .font(.title2)
                Text("禅定花园")
                    .font(.custom("Georgia", size: 22))
                    .fontWeight(.semibold)
                Text("☸")
                    .font(.title2)
            }
            .foregroundColor(Color(hex: "#D4AF37"))

            Text("木鱼与禅堂")
                .font(.caption)
                .foregroundColor(Color(hex: "#8B7355"))

            // 数据面板
            HStack(spacing: 0) {
                StatCard(
                    value: store.state.totalMerit.meritFormatted,
                    label: "累计功德"
                )

                Divider()
                    .frame(width: 1)
                    .background(Color(hex: "#3D2B1F"))

                VStack(spacing: 2) {
                    Text(store.state.currentLevel.name)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "#D4AF37"))
                    Text("Lv.\(store.state.currentLevel.rawValue) 境界")
                        .font(.caption2)
                        .foregroundColor(Color(hex: "#8B7355"))
                }
                .frame(maxWidth: .infinity)

                Divider()
                    .frame(width: 1)
                    .background(Color(hex: "#3D2B1F"))

                StatCard(
                    value: store.state.sessionMerit.meritFormatted,
                    label: "本次敲击"
                )
            }
            .frame(height: 56)
            .background(Color(hex: "#1A0F0A"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
            )
            .padding(.horizontal, 16)
        }
    }
}

struct StatCard: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(Color(hex: "#F5E6C8"))
            Text(label)
                .font(.caption2)
                .foregroundColor(Color(hex: "#8B7355"))
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - 功能按钮栏
struct ActionButtonsView: View {
    @EnvironmentObject var store: ZenStore

    var body: some View {
        HStack(spacing: 8) {
            ActionButton(
                icon: store.isMusicPlaying ? "pause.circle.fill" : "music.note",
                label: "禅意音乐",
                isActive: store.isMusicPlaying
            ) {
                store.isMusicPlaying.toggle()
            }

            ActionButton(
                icon: "square.and.arrow.up",
                label: "分享成就",
                isActive: false
            ) {
                shareAchievement(store: store)
            }

            ActionButton(
                icon: "applewatch",
                label: "双屏联动",
                isActive: store.isWatchConnected
            ) {
                store.showDualScreen = true
            }

            ActionButton(
                icon: "building.columns.fill",
                label: "禅堂图鉴",
                isActive: store.showTempleGallery
            ) {
                store.showTempleGallery = true
            }

            ActionButton(
                icon: "chart.bar.fill",
                label: "修行统计",
                isActive: store.showStats
            ) {
                store.showStats = true
            }
        }
        .padding(.horizontal, 12)
    }
}

struct ActionButton: View {
    let icon: String
    let label: String
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 3) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                Text(label)
                    .font(.system(size: 9))
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
            }
            .foregroundColor(isActive ? Color(hex: "#D4AF37") : Color(hex: "#8B7355"))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isActive ? Color(hex: "#2A1F0F") : Color(hex: "#1A0F0A"))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(
                                isActive ? Color(hex: "#D4AF37").opacity(0.5) : Color(hex: "#3D2B1F"),
                                lineWidth: 1
                            )
                    )
            )
        }
    }
}

// MARK: - 禅堂主视图
struct TempleView: View {
    @EnvironmentObject var store: ZenStore

    var body: some View {
        ZStack {
            // 禅堂背景图
            TempleBackgroundView(level: store.state.currentLevel)

            // 底部信息叠层
            VStack {
                Spacer()
                TempleInfoOverlay()
            }
        }
        .clipped()
    }
}

struct TempleBackgroundView: View {
    let level: ZenLevel

    var body: some View {
        ZStack {
            // 渐变背景（替代实际图片）
            LinearGradient(
                colors: [
                    Color(hex: "#0D0A06"),
                    Color(hex: "#1A1208"),
                    Color(hex: "#0D0A06")
                ],
                startPoint: .top,
                endPoint: .bottom
            )

            // 禅堂场景绘制
            TempleSceneView(level: level)
        }
    }
}

struct TempleSceneView: View {
    let level: ZenLevel
    @State private var glowOpacity: Double = 0.3

    var body: some View {
        ZStack {
            // 中央佛像光晕
            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color(hex: "#D4AF37").opacity(glowOpacity),
                            Color.clear
                        ],
                        center: .center,
                        startRadius: 20,
                        endRadius: 120
                    )
                )
                .frame(width: 240, height: 240)
                .offset(y: -20)
                .onAppear {
                    withAnimation(.easeInOut(duration: 2.5).repeatForever(autoreverses: true)) {
                        glowOpacity = 0.6
                    }
                }

            // 禅堂建筑轮廓
            TempleSilhouette(level: level)

            // 境界文字
            VStack(spacing: 4) {
                Text("Lv.\(level.rawValue)")
                    .font(.system(size: 12, weight: .light))
                    .foregroundColor(Color(hex: "#8B7355"))
                Text(level.name)
                    .font(.custom("Georgia", size: 20))
                    .fontWeight(.semibold)
                    .foregroundColor(Color(hex: "#D4AF37"))
            }
            .offset(y: 60)
        }
    }
}

struct TempleSilhouette: View {
    let level: ZenLevel

    var body: some View {
        Canvas { context, size in
            let cx = size.width / 2
            let cy = size.height / 2

            // 绘制禅堂轮廓
            let goldColor = Color(hex: "#D4AF37").opacity(0.15)
            let dimColor = Color(hex: "#8B7355").opacity(0.08)

            // 地基
            var basePath = Path()
            basePath.move(to: CGPoint(x: cx - 100, y: cy + 40))
            basePath.addLine(to: CGPoint(x: cx + 100, y: cy + 40))
            basePath.addLine(to: CGPoint(x: cx + 90, y: cy + 20))
            basePath.addLine(to: CGPoint(x: cx - 90, y: cy + 20))
            basePath.closeSubpath()
            context.fill(basePath, with: .color(dimColor))

            // 主殿
            var mainPath = Path()
            mainPath.move(to: CGPoint(x: cx - 80, y: cy + 20))
            mainPath.addLine(to: CGPoint(x: cx + 80, y: cy + 20))
            mainPath.addLine(to: CGPoint(x: cx + 70, y: cy - 30))
            mainPath.addLine(to: CGPoint(x: cx - 70, y: cy - 30))
            mainPath.closeSubpath()
            context.fill(mainPath, with: .color(dimColor))
            context.stroke(mainPath, with: .color(goldColor), lineWidth: 0.5)

            // 屋顶
            var roofPath = Path()
            roofPath.move(to: CGPoint(x: cx - 90, y: cy - 28))
            roofPath.addLine(to: CGPoint(x: cx, y: cy - 80))
            roofPath.addLine(to: CGPoint(x: cx + 90, y: cy - 28))
            roofPath.closeSubpath()
            context.fill(roofPath, with: .color(dimColor))
            context.stroke(roofPath, with: .color(goldColor), lineWidth: 0.8)

            // 宝顶
            var topPath = Path()
            topPath.move(to: CGPoint(x: cx - 10, y: cy - 80))
            topPath.addLine(to: CGPoint(x: cx, y: cy - 100))
            topPath.addLine(to: CGPoint(x: cx + 10, y: cy - 80))
            topPath.closeSubpath()
            context.fill(topPath, with: .color(goldColor))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct TempleInfoOverlay: View {
    @EnvironmentObject var store: ZenStore

    var body: some View {
        VStack(spacing: 0) {
            // 进度条
            if let nextLevel = store.state.currentLevel.next {
                VStack(spacing: 4) {
                    HStack {
                        Text("距离下一境界")
                            .font(.caption2)
                            .foregroundColor(Color(hex: "#8B7355"))
                        Spacer()
                        Text(String(format: "%.1f%%", store.state.progressToNextLevel * 100))
                            .font(.caption2)
                            .foregroundColor(Color(hex: "#D4AF37"))
                    }

                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color(hex: "#2A1F0F"))
                                .frame(height: 4)
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color(hex: "#D4AF37"))
                                .frame(width: geo.size.width * store.state.progressToNextLevel, height: 4)
                        }
                    }
                    .frame(height: 4)

                    HStack {
                        Text(store.state.currentLevel.name)
                            .font(.caption2)
                            .foregroundColor(Color(hex: "#8B7355"))
                        Spacer()
                        Text(nextLevel.name + " (\(nextLevel.requiredMerit.meritFormatted))")
                            .font(.caption2)
                            .foregroundColor(Color(hex: "#8B7355"))
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
            }

            // 场景描述
            Text(store.state.currentLevel.description)
                .font(.caption)
                .foregroundColor(Color(hex: "#8B7355"))
                .multilineTextAlignment(.center)
                .lineLimit(3)
                .padding(.horizontal, 20)
                .padding(.bottom, 12)
        }
        .background(
            LinearGradient(
                colors: [Color.clear, Color.black.opacity(0.8)],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}

// MARK: - 佛珠视图
struct BeadsView: View {
    @EnvironmentObject var store: ZenStore
    @State private var beadRotation: Double = 0
    @State private var isAnimating: Bool = false

    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            // 佛珠环
            ZStack {
                BeadRingView(
                    beadType: store.state.currentBeadType,
                    rotation: beadRotation
                )
                .frame(width: 260, height: 260)

                // 中央木鱼
                WoodenFishButton {
                    tapBead()
                }
            }
            .gesture(
                DragGesture()
                    .onChanged { value in
                        let delta = value.translation.width
                        beadRotation += delta * 0.3
                    }
            )

            // 操作提示
            Text("卍  点击或向右滑动拨珠")
                .font(.caption)
                .foregroundColor(Color(hex: "#8B7355"))

            // 珠串选择
            BeadSelector()

            // 快速计数按钮
            QuickCountButtons()

            Spacer()
        }
    }

    private func tapBead() {
        store.addMerit(1)
        withAnimation(.spring(response: 0.2, dampingFraction: 0.6)) {
            beadRotation += 15
        }
    }
}

struct BeadRingView: View {
    let beadType: BeadType
    let rotation: Double
    private let beadCount = 18
    private let radius: CGFloat = 110

    var beadColor: Color {
        switch beadType {
        case .bodhi: return Color(hex: "#C8A96E")
        case .glass: return Color(hex: "#7EC8E3")
        case .redAgate: return Color(hex: "#C0392B")
        }
    }

    var body: some View {
        ZStack {
            // 佛珠连线
            Circle()
                .stroke(Color(hex: "#5C4A32").opacity(0.4), lineWidth: 1)
                .frame(width: radius * 2, height: radius * 2)

            // 佛珠
            ForEach(0..<beadCount, id: \.self) { index in
                let angle = (Double(index) / Double(beadCount)) * 360 + rotation
                let radian = angle * .pi / 180
                let x = cos(radian) * radius
                let y = sin(radian) * radius

                BeadView(color: beadColor, size: index == 0 ? 20 : 16)
                    .offset(x: x, y: y)
            }
        }
    }
}

struct BeadView: View {
    let color: Color
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            color.opacity(0.9),
                            color.opacity(0.6),
                            color.opacity(0.3)
                        ],
                        center: UnitPoint(x: 0.35, y: 0.35),
                        startRadius: 0,
                        endRadius: size / 2
                    )
                )
                .frame(width: size, height: size)

            Circle()
                .stroke(color.opacity(0.3), lineWidth: 0.5)
                .frame(width: size, height: size)
        }
        .shadow(color: color.opacity(0.3), radius: 2)
    }
}

struct WoodenFishButton: View {
    let action: () -> Void
    @State private var isPressed: Bool = false

    var body: some View {
        Button(action: {
            withAnimation(.spring(response: 0.15, dampingFraction: 0.5)) {
                isPressed = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                withAnimation(.spring(response: 0.15, dampingFraction: 0.5)) {
                    isPressed = false
                }
            }
            action()
        }) {
            ZStack {
                // 木鱼底座阴影
                Ellipse()
                    .fill(Color.black.opacity(0.4))
                    .frame(width: 80, height: 24)
                    .offset(y: 30)

                // 木鱼主体
                Ellipse()
                    .fill(
                        RadialGradient(
                            colors: [
                                Color(hex: "#8B5E3C"),
                                Color(hex: "#5C3D1E"),
                                Color(hex: "#3D2510")
                            ],
                            center: UnitPoint(x: 0.4, y: 0.35),
                            startRadius: 5,
                            endRadius: 40
                        )
                    )
                    .frame(width: 80, height: 56)
                    .overlay(
                        Ellipse()
                            .stroke(Color(hex: "#C8A96E").opacity(0.3), lineWidth: 1)
                    )

                // 木鱼纹路
                Path { path in
                    path.move(to: CGPoint(x: -15, y: 0))
                    path.addCurve(
                        to: CGPoint(x: 15, y: 0),
                        control1: CGPoint(x: -5, y: -8),
                        control2: CGPoint(x: 5, y: -8)
                    )
                }
                .stroke(Color(hex: "#C8A96E").opacity(0.2), lineWidth: 1.5)

                // 敲击点
                Circle()
                    .fill(Color(hex: "#C8A96E").opacity(0.15))
                    .frame(width: 20, height: 20)
            }
            .scaleEffect(isPressed ? 0.92 : 1.0)
        }
        .buttonStyle(.plain)
    }
}

struct BeadSelector: View {
    @EnvironmentObject var store: ZenStore

    var body: some View {
        HStack(spacing: 16) {
            ForEach(BeadType.allCases, id: \.self) { type in
                Button(action: { store.changeBead(type) }) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color(hex: type.colorHex))
                            .frame(width: 12, height: 12)
                        Text(type.rawValue)
                            .font(.caption)
                            .foregroundColor(
                                store.state.currentBeadType == type
                                    ? Color(hex: "#D4AF37")
                                    : Color(hex: "#8B7355")
                            )
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(
                                store.state.currentBeadType == type
                                    ? Color(hex: "#2A1F0F")
                                    : Color.clear
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(
                                        store.state.currentBeadType == type
                                            ? Color(hex: "#D4AF37").opacity(0.4)
                                            : Color(hex: "#3D2B1F"),
                                        lineWidth: 1
                                    )
                            )
                    )
                }
                .buttonStyle(.plain)
            }
        }
    }
}

struct QuickCountButtons: View {
    @EnvironmentObject var store: ZenStore

    var body: some View {
        HStack(spacing: 8) {
            ForEach([("+1", 1), ("+十", 10), ("+百", 100), ("+千", 1000)], id: \.0) { label, amount in
                Button(action: { store.addMerit(amount) }) {
                    Text(label)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "#D4AF37"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color(hex: "#1A0F0A"))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
                                )
                        )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
    }
}

// MARK: - 底部标签栏
struct BottomTabBar: View {
    @Binding var activeTab: ContentView.Tab

    var body: some View {
        HStack {
            TabBarButton(
                icon: "building.columns.fill",
                label: "禅堂",
                isActive: activeTab == .temple
            ) {
                activeTab = .temple
            }

            TabBarButton(
                icon: "circle.grid.cross.fill",
                label: "佛珠",
                isActive: activeTab == .beads
            ) {
                activeTab = .beads
            }
        }
        .padding(.vertical, 8)
        .background(Color(hex: "#0D0A06"))
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(hex: "#3D2B1F")),
            alignment: .top
        )
    }
}

struct TabBarButton: View {
    let icon: String
    let label: String
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 3) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                Text(label)
                    .font(.caption2)
            }
            .foregroundColor(isActive ? Color(hex: "#D4AF37") : Color(hex: "#8B7355"))
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - 禅堂图鉴视图
struct TempleGalleryView: View {
    @EnvironmentObject var store: ZenStore
    @Environment(\.dismiss) var dismiss

    let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible())
    ]

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                VStack(spacing: 16) {
                    Text("已解锁 1 / 10 境界")
                        .font(.caption)
                        .foregroundColor(Color(hex: "#8B7355"))

                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(ZenLevel.allCases, id: \.rawValue) { level in
                            TempleCard(
                                level: level,
                                isUnlocked: store.state.totalMerit >= level.requiredMerit
                            )
                        }
                    }
                    .padding(.horizontal, 16)

                    Spacer()
                }
                .padding(.top, 16)
            }
            .navigationTitle("禅堂图鉴")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") { dismiss() }
                        .foregroundColor(Color(hex: "#D4AF37"))
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct TempleCard: View {
    let level: ZenLevel
    let isUnlocked: Bool

    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(hex: "#1A0F0A"))
                    .frame(height: 60)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(
                                isUnlocked ? Color(hex: "#D4AF37").opacity(0.5) : Color(hex: "#3D2B1F"),
                                lineWidth: 1
                            )
                    )

                if isUnlocked {
                    Image(systemName: "building.columns.fill")
                        .font(.title2)
                        .foregroundColor(Color(hex: "#D4AF37").opacity(0.7))
                } else {
                    Image(systemName: "lock.fill")
                        .font(.title3)
                        .foregroundColor(Color(hex: "#8B7355").opacity(0.5))
                }

                VStack {
                    HStack {
                        Text("Lv.\(level.rawValue)")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(isUnlocked ? Color(hex: "#D4AF37") : Color(hex: "#8B7355"))
                            .padding(3)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(4)
                        Spacer()
                    }
                    Spacer()
                }
                .padding(4)
            }

            Text(level.name)
                .font(.system(size: 9))
                .foregroundColor(isUnlocked ? Color(hex: "#F5E6C8") : Color(hex: "#8B7355"))
                .lineLimit(1)
                .minimumScaleFactor(0.7)

            if !isUnlocked {
                Text(level.requiredMerit.meritFormatted)
                    .font(.system(size: 8))
                    .foregroundColor(Color(hex: "#8B7355").opacity(0.7))
            }
        }
    }
}

// MARK: - 修行统计视图
struct StatsView: View {
    @EnvironmentObject var store: ZenStore
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 16) {
                        Text("记录您的修行历程")
                            .font(.caption)
                            .foregroundColor(Color(hex: "#8B7355"))

                        // 主要统计
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            StatsCard(
                                value: store.state.totalMerit.meritFormatted,
                                label: "累计功德",
                                sublabel: "\(store.state.totalMerit) 次"
                            )
                            StatsCard(
                                value: "Lv.\(store.state.currentLevel.rawValue)",
                                label: "当前境界",
                                sublabel: store.state.currentLevel.name
                            )
                            StatsCard(
                                value: store.state.sessionMerit.meritFormatted,
                                label: "本次敲击",
                                sublabel: "本次会话"
                            )
                            StatsCard(
                                value: "1 / 10",
                                label: "已解锁境界",
                                sublabel: "个禅堂等级"
                            )
                        }
                        .padding(.horizontal, 16)

                        // 进度条
                        if let nextLevel = store.state.currentLevel.next {
                            VStack(spacing: 8) {
                                HStack {
                                    Text("距离下一境界")
                                        .font(.subheadline)
                                        .foregroundColor(Color(hex: "#F5E6C8"))
                                    Spacer()
                                    Text(String(format: "%.1f%%", store.state.progressToNextLevel * 100))
                                        .font(.subheadline)
                                        .foregroundColor(Color(hex: "#D4AF37"))
                                }

                                GeometryReader { geo in
                                    ZStack(alignment: .leading) {
                                        RoundedRectangle(cornerRadius: 4)
                                            .fill(Color(hex: "#2A1F0F"))
                                            .frame(height: 8)
                                        RoundedRectangle(cornerRadius: 4)
                                            .fill(
                                                LinearGradient(
                                                    colors: [Color(hex: "#D4AF37"), Color(hex: "#F5E6C8")],
                                                    startPoint: .leading,
                                                    endPoint: .trailing
                                                )
                                            )
                                            .frame(width: geo.size.width * store.state.progressToNextLevel, height: 8)
                                    }
                                }
                                .frame(height: 8)

                                HStack {
                                    Text(store.state.currentLevel.name + " (\(store.state.totalMerit.meritFormatted))")
                                        .font(.caption2)
                                        .foregroundColor(Color(hex: "#8B7355"))
                                    Spacer()
                                    Text(nextLevel.name + " (\(nextLevel.requiredMerit.meritFormatted))")
                                        .font(.caption2)
                                        .foregroundColor(Color(hex: "#8B7355"))
                                }

                                Text("还差 \(store.state.meritToNextLevel.meritFormatted) 功德")
                                    .font(.caption)
                                    .foregroundColor(Color(hex: "#D4AF37"))
                            }
                            .padding(16)
                            .background(Color(hex: "#1A0F0A"))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
                            )
                            .padding(.horizontal, 16)
                        }

                        // 修行里程碑
                        VStack(alignment: .leading, spacing: 8) {
                            Text("· 修行里程碑 ·")
                                .font(.subheadline)
                                .foregroundColor(Color(hex: "#D4AF37"))
                                .frame(maxWidth: .infinity)

                            ForEach(ZenLevel.allCases, id: \.rawValue) { level in
                                HStack {
                                    Circle()
                                        .fill(
                                            store.state.totalMerit >= level.requiredMerit
                                                ? Color(hex: "#D4AF37")
                                                : Color(hex: "#3D2B1F")
                                        )
                                        .frame(width: 8, height: 8)
                                    Text(level.name)
                                        .font(.caption)
                                        .foregroundColor(
                                            store.state.totalMerit >= level.requiredMerit
                                                ? Color(hex: "#F5E6C8")
                                                : Color(hex: "#8B7355")
                                        )
                                    Spacer()
                                    Text(level.requiredMerit.meritFormatted)
                                        .font(.caption)
                                        .foregroundColor(Color(hex: "#8B7355"))
                                }
                            }
                        }
                        .padding(16)
                        .background(Color(hex: "#1A0F0A"))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
                        )
                        .padding(.horizontal, 16)

                        // 重置按钮
                        Button(action: { store.resetSession() }) {
                            Text("重置本次功德")
                                .font(.subheadline)
                                .foregroundColor(Color(hex: "#8B7355"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color(hex: "#1A0F0A"))
                                .cornerRadius(10)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
                                )
                        }
                        .padding(.horizontal, 16)

                        Spacer(minLength: 20)
                    }
                    .padding(.top, 16)
                }
            }
            .navigationTitle("修行统计")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") { dismiss() }
                        .foregroundColor(Color(hex: "#D4AF37"))
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct StatsCard: View {
    let value: String
    let label: String
    let sublabel: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 24, weight: .bold, design: .rounded))
                .foregroundColor(Color(hex: "#D4AF37"))
            Text(label)
                .font(.caption)
                .foregroundColor(Color(hex: "#F5E6C8"))
            Text(sublabel)
                .font(.caption2)
                .foregroundColor(Color(hex: "#8B7355"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color(hex: "#1A0F0A"))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
        )
    }
}

// MARK: - 双屏联动说明视图
struct DualScreenInfoView: View {
    @EnvironmentObject var store: ZenStore
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()

                VStack(spacing: 24) {
                    // Watch 状态
                    VStack(spacing: 12) {
                        Image(systemName: store.isWatchConnected ? "applewatch.radiowaves.left.and.right" : "applewatch")
                            .font(.system(size: 48))
                            .foregroundColor(store.isWatchConnected ? Color(hex: "#D4AF37") : Color(hex: "#8B7355"))

                        Text(store.isWatchConnected ? "Apple Watch 已连接" : "Apple Watch 未连接")
                            .font(.headline)
                            .foregroundColor(store.isWatchConnected ? Color(hex: "#D4AF37") : Color(hex: "#8B7355"))

                        Text(store.isWatchConnected
                             ? "双屏联动已激活，Watch 上的拨珠将同步到 iPhone"
                             : "请确保 Apple Watch 已配对并安装禅定花园 Watch 应用")
                            .font(.caption)
                            .foregroundColor(Color(hex: "#8B7355"))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }

                    // 功能说明
                    VStack(alignment: .leading, spacing: 12) {
                        Text("双屏联动功能")
                            .font(.subheadline)
                            .foregroundColor(Color(hex: "#D4AF37"))

                        FeatureRow(icon: "applewatch", text: "Apple Watch 显示佛珠拨珠界面")
                        FeatureRow(icon: "iphone", text: "iPhone 实时展示禅堂场景")
                        FeatureRow(icon: "arrow.left.arrow.right", text: "功德计数实时双向同步")
                        FeatureRow(icon: "hand.tap", text: "Watch 上拨珠，iPhone 同步更新")
                    }
                    .padding(16)
                    .background(Color(hex: "#1A0F0A"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "#3D2B1F"), lineWidth: 1)
                    )
                    .padding(.horizontal, 16)

                    Spacer()
                }
                .padding(.top, 32)
            }
            .navigationTitle("⌚ 双屏联动")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") { dismiss() }
                        .foregroundColor(Color(hex: "#D4AF37"))
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct FeatureRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "#D4AF37"))
                .frame(width: 24)
            Text(text)
                .font(.caption)
                .foregroundColor(Color(hex: "#F5E6C8"))
        }
    }
}

// MARK: - 分享功能
func shareAchievement(store: ZenStore) {
    let text = """
    🏯 禅定花园 · 修行成就
    
    境界：\(store.state.currentLevel.name)（Lv.\(store.state.currentLevel.rawValue)）
    累计功德：\(store.state.totalMerit.meritFormatted)
    
    卍 修行之路，功德无量 卍
    """

    let activityVC = UIActivityViewController(
        activityItems: [text],
        applicationActivities: nil
    )

    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
       let window = windowScene.windows.first,
       let rootVC = window.rootViewController {
        rootVC.present(activityVC, animated: true)
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

#Preview {
    ContentView()
        .environmentObject(ZenStore())
}
