// WatchContentView.swift
// 禅定花园 - watchOS 主界面

import SwiftUI

struct WatchContentView: View {
    @EnvironmentObject var store: WatchStore

    var body: some View {
        TabView {
            // 主界面 - 佛珠
            WatchBeadsView()
                .tag(0)

            // 统计界面
            WatchStatsView()
                .tag(1)

            // 设置界面
            WatchSettingsView()
                .tag(2)
        }
        .tabViewStyle(.page)
    }
}

// MARK: - 佛珠主界面
struct WatchBeadsView: View {
    @EnvironmentObject var store: WatchStore
    @State private var beadRotation: Double = 0
    @State private var showTapEffect: Bool = false
    @State private var crownAccumulator: Double = 0

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 4) {
                // 顶部信息
                HStack {
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Lv.\(store.currentLevel.rawValue)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "#D4AF37"))
                        Text(store.currentLevel.name)
                            .font(.system(size: 9))
                            .foregroundColor(Color(hex: "#8B7355"))
                            .lineLimit(1)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 1) {
                        Text(store.totalMerit.meritFormatted)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "#F5E6C8"))
                        Text("功德")
                            .font(.system(size: 9))
                            .foregroundColor(Color(hex: "#8B7355"))
                    }
                }
                .padding(.horizontal, 8)
                .padding(.top, 2)

                // 佛珠环 + 木鱼
                ZStack {
                    WatchBeadRingView(
                        beadType: store.currentBeadType,
                        rotation: beadRotation
                    )
                    .frame(width: 120, height: 120)

                    // 中央木鱼按钮
                    WatchWoodenFishButton {
                        tapAction()
                    }

                    // 点击效果
                    if showTapEffect {
                        Circle()
                            .stroke(Color(hex: "#D4AF37").opacity(0.6), lineWidth: 2)
                            .frame(width: 50, height: 50)
                            .scaleEffect(showTapEffect ? 1.5 : 1.0)
                            .opacity(showTapEffect ? 0 : 1)
                    }
                }

                // 本次功德
                Text("+\(store.sessionMerit)")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(hex: "#D4AF37"))

                // 进度条
                WatchProgressBar(progress: store.progressToNextLevel)
                    .frame(height: 3)
                    .padding(.horizontal, 12)
            }
        }
        .focusable()
        .digitalCrownRotation(
            $crownAccumulator,
            from: -1000,
            through: 1000,
            by: 0.1,
            sensitivity: .medium,
            isContinuous: true,
            isHapticFeedbackEnabled: true
        )
        .onChange(of: crownAccumulator) { newValue in
            handleCrownChange(newValue)
        }
        .onTapGesture {
            tapAction()
        }
    }

    private func tapAction() {
        store.addMerit(1)
        withAnimation(.spring(response: 0.2, dampingFraction: 0.5)) {
            beadRotation += 15
            showTapEffect = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            showTapEffect = false
        }
    }

    private var lastCrownValue: Double = 0

    private func handleCrownChange(_ newValue: Double) {
        let delta = newValue - crownAccumulator
        if abs(delta) > 0.5 {
            store.addMerit(1)
            withAnimation(.spring(response: 0.15, dampingFraction: 0.6)) {
                beadRotation += delta > 0 ? 15 : -15
            }
        }
    }
}

// MARK: - Watch 佛珠环
struct WatchBeadRingView: View {
    let beadType: BeadType
    let rotation: Double
    private let beadCount = 12
    private let radius: CGFloat = 48

    var beadColor: Color {
        switch beadType {
        case .bodhi: return Color(hex: "#C8A96E")
        case .glass: return Color(hex: "#7EC8E3")
        case .redAgate: return Color(hex: "#C0392B")
        }
    }

    var body: some View {
        ZStack {
            // 连线
            Circle()
                .stroke(Color(hex: "#5C4A32").opacity(0.3), lineWidth: 0.5)
                .frame(width: radius * 2, height: radius * 2)

            // 佛珠
            ForEach(0..<beadCount, id: \.self) { index in
                let angle = (Double(index) / Double(beadCount)) * 360 + rotation
                let radian = angle * .pi / 180
                let x = cos(radian) * radius
                let y = sin(radian) * radius

                WatchBeadView(
                    color: beadColor,
                    size: index == 0 ? 10 : 8
                )
                .offset(x: x, y: y)
            }
        }
    }
}

struct WatchBeadView: View {
    let color: Color
    let size: CGFloat

    var body: some View {
        Circle()
            .fill(
                RadialGradient(
                    colors: [color.opacity(0.9), color.opacity(0.4)],
                    center: UnitPoint(x: 0.35, y: 0.35),
                    startRadius: 0,
                    endRadius: size / 2
                )
            )
            .frame(width: size, height: size)
            .shadow(color: color.opacity(0.3), radius: 1)
    }
}

// MARK: - Watch 木鱼按钮
struct WatchWoodenFishButton: View {
    let action: () -> Void
    @State private var isPressed: Bool = false

    var body: some View {
        Button(action: {
            withAnimation(.spring(response: 0.1, dampingFraction: 0.5)) {
                isPressed = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                withAnimation {
                    isPressed = false
                }
            }
            action()
        }) {
            ZStack {
                Ellipse()
                    .fill(
                        RadialGradient(
                            colors: [
                                Color(hex: "#8B5E3C"),
                                Color(hex: "#3D2510")
                            ],
                            center: UnitPoint(x: 0.4, y: 0.35),
                            startRadius: 2,
                            endRadius: 18
                        )
                    )
                    .frame(width: 36, height: 26)
                    .overlay(
                        Ellipse()
                            .stroke(Color(hex: "#C8A96E").opacity(0.3), lineWidth: 0.5)
                    )
            }
            .scaleEffect(isPressed ? 0.88 : 1.0)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Watch 进度条
struct WatchProgressBar: View {
    let progress: Double

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 1.5)
                    .fill(Color(hex: "#2A1F0F"))
                RoundedRectangle(cornerRadius: 1.5)
                    .fill(Color(hex: "#D4AF37"))
                    .frame(width: geo.size.width * progress)
            }
        }
    }
}

// MARK: - Watch 统计界面
struct WatchStatsView: View {
    @EnvironmentObject var store: WatchStore

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 8) {
                    Text("修行统计")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "#D4AF37"))

                    // 统计卡片
                    WatchStatRow(label: "累计功德", value: store.totalMerit.meritFormatted)
                    WatchStatRow(label: "本次功德", value: store.sessionMerit.meritFormatted)
                    WatchStatRow(label: "当前境界", value: "Lv.\(store.currentLevel.rawValue)")
                    WatchStatRow(label: "境界名称", value: store.currentLevel.name)

                    // 进度
                    if let nextLevel = store.currentLevel.next {
                        VStack(spacing: 4) {
                            HStack {
                                Text("距下一境界")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "#8B7355"))
                                Spacer()
                                Text(String(format: "%.0f%%", store.progressToNextLevel * 100))
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(hex: "#D4AF37"))
                            }

                            WatchProgressBar(progress: store.progressToNextLevel)
                                .frame(height: 4)

                            Text(nextLevel.name)
                                .font(.system(size: 9))
                                .foregroundColor(Color(hex: "#8B7355"))
                        }
                        .padding(8)
                        .background(Color(hex: "#1A0F0A"))
                        .cornerRadius(8)
                    }

                    // iPhone 连接状态
                    HStack(spacing: 4) {
                        Circle()
                            .fill(store.isPhoneConnected ? Color.green : Color(hex: "#8B7355"))
                            .frame(width: 6, height: 6)
                        Text(store.isPhoneConnected ? "iPhone 已连接" : "iPhone 未连接")
                            .font(.system(size: 9))
                            .foregroundColor(Color(hex: "#8B7355"))
                    }
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
            }
        }
    }
}

struct WatchStatRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 10))
                .foregroundColor(Color(hex: "#8B7355"))
            Spacer()
            Text(value)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Color(hex: "#F5E6C8"))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Color(hex: "#1A0F0A"))
        .cornerRadius(6)
    }
}

// MARK: - Watch 设置界面
struct WatchSettingsView: View {
    @EnvironmentObject var store: WatchStore

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            VStack(spacing: 8) {
                Text("设置")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "#D4AF37"))

                // 珠串选择
                Text("珠串样式")
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "#8B7355"))

                ForEach(BeadType.allCases, id: \.self) { type in
                    Button(action: { store.changeBead(type) }) {
                        HStack(spacing: 8) {
                            Circle()
                                .fill(Color(hex: type.colorHex))
                                .frame(width: 10, height: 10)
                            Text(type.rawValue)
                                .font(.system(size: 11))
                                .foregroundColor(
                                    store.currentBeadType == type
                                        ? Color(hex: "#D4AF37")
                                        : Color(hex: "#F5E6C8")
                                )
                            Spacer()
                            if store.currentBeadType == type {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(hex: "#D4AF37"))
                            }
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 6)
                                .fill(
                                    store.currentBeadType == type
                                        ? Color(hex: "#2A1F0F")
                                        : Color(hex: "#1A0F0A")
                                )
                        )
                    }
                    .buttonStyle(.plain)
                }

                Divider()
                    .background(Color(hex: "#3D2B1F"))

                // 重置按钮
                Button(action: { store.resetSession() }) {
                    Text("重置本次功德")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "#8B7355"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color(hex: "#1A0F0A"))
                        .cornerRadius(6)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
        }
    }
}

// MARK: - Color Extension (Watch)
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
    WatchContentView()
        .environmentObject(WatchStore())
}
