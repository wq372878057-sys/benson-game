// WatchStore.swift
// 禅定花园 - watchOS 状态管理

import SwiftUI
import WatchConnectivity

class WatchStore: NSObject, ObservableObject {
    @Published var totalMerit: Int = 0
    @Published var sessionMerit: Int = 0
    @Published var currentLevel: ZenLevel = .level1
    @Published var currentBeadType: BeadType = .bodhi
    @Published var isPhoneConnected: Bool = false
    @Published var crownValue: Double = 0.0

    private let stateKey = "WatchZenState"

    override init() {
        super.init()
        loadLocalState()
        setupWatchConnectivity()
    }

    // MARK: - 功德操作
    func addMerit(_ amount: Int) {
        totalMerit += amount
        sessionMerit += amount
        currentLevel = ZenLevel.level(for: totalMerit)
        saveLocalState()

        // 触觉反馈
        WKInterfaceDevice.current().play(.click)

        // 同步到 iPhone
        sendToPhone(action: WCMessageKey.addMerit, amount: amount)
    }

    func resetSession() {
        sessionMerit = 0
        saveLocalState()
        sendResetToPhone()
    }

    func changeBead(_ type: BeadType) {
        currentBeadType = type
        saveLocalState()
    }

    // MARK: - 数字表冠处理
    func handleCrownDelta(_ delta: Double) {
        let threshold = 0.15
        if abs(delta) >= threshold {
            addMerit(1)
            // 重置累积值
            crownValue = 0
        }
    }

    // MARK: - 本地持久化
    private func saveLocalState() {
        UserDefaults.standard.set(totalMerit, forKey: "\(stateKey).merit")
        UserDefaults.standard.set(sessionMerit, forKey: "\(stateKey).session")
        UserDefaults.standard.set(currentLevel.rawValue, forKey: "\(stateKey).level")
        UserDefaults.standard.set(currentBeadType.rawValue, forKey: "\(stateKey).bead")
    }

    private func loadLocalState() {
        totalMerit = UserDefaults.standard.integer(forKey: "\(stateKey).merit")
        sessionMerit = UserDefaults.standard.integer(forKey: "\(stateKey).session")
        if let levelRaw = UserDefaults.standard.object(forKey: "\(stateKey).level") as? Int,
           let level = ZenLevel(rawValue: levelRaw) {
            currentLevel = level
        }
        if let beadRaw = UserDefaults.standard.string(forKey: "\(stateKey).bead"),
           let bead = BeadType(rawValue: beadRaw) {
            currentBeadType = bead
        }
    }

    // MARK: - WatchConnectivity
    private func setupWatchConnectivity() {
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    private func sendToPhone(action: String, amount: Int) {
        guard WCSession.default.isReachable else { return }
        let message: [String: Any] = [
            WCMessageKey.action: action,
            WCMessageKey.amount: amount
        ]
        WCSession.default.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    private func sendResetToPhone() {
        guard WCSession.default.isReachable else { return }
        let message: [String: Any] = [WCMessageKey.action: WCMessageKey.resetSession]
        WCSession.default.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    var progressToNextLevel: Double {
        guard let nextLevel = currentLevel.next else { return 1.0 }
        let current = Double(totalMerit - currentLevel.requiredMerit)
        let total = Double(nextLevel.requiredMerit - currentLevel.requiredMerit)
        return min(current / total, 1.0)
    }
}

// MARK: - WCSessionDelegate
extension WatchStore: WCSessionDelegate {
    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        DispatchQueue.main.async {
            self.isPhoneConnected = (activationState == .activated)
        }
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async {
            if let merit = message[WCMessageKey.merit] as? Int {
                self.totalMerit = merit
            }
            if let sessionMerit = message[WCMessageKey.sessionMerit] as? Int {
                self.sessionMerit = sessionMerit
            }
            if let levelRaw = message[WCMessageKey.level] as? Int,
               let level = ZenLevel(rawValue: levelRaw) {
                self.currentLevel = level
            }
            if let beadRaw = message[WCMessageKey.beadType] as? String,
               let bead = BeadType(rawValue: beadRaw) {
                self.currentBeadType = bead
            }
            self.saveLocalState()
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        DispatchQueue.main.async {
            self.isPhoneConnected = session.isReachable
        }
    }
}
