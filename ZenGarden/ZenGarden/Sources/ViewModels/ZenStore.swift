// ZenStore.swift
// 禅定花园 - iOS 核心状态管理

import SwiftUI
import Combine
import WatchConnectivity

class ZenStore: NSObject, ObservableObject {
    @Published var state: ZenState = ZenState()
    @Published var isWatchConnected: Bool = false
    @Published var isMusicPlaying: Bool = false
    @Published var showTempleGallery: Bool = false
    @Published var showStats: Bool = false
    @Published var showDualScreen: Bool = false

    private let stateKey = "ZenGardenState"
    private var session: WCSession?

    override init() {
        super.init()
        loadState()
        setupWatchConnectivity()
    }

    // MARK: - 功德操作
    func addMerit(_ amount: Int) {
        let previousLevel = state.currentLevel
        state.addMerit(amount)

        // 触觉反馈
        let generator = UIImpactFeedbackGenerator(style: amount == 1 ? .light : .medium)
        generator.impactOccurred()

        // 境界提升通知
        if state.currentLevel != previousLevel {
            let notification = UINotificationFeedbackGenerator()
            notification.notificationOccurred(.success)
        }

        saveState()
        syncToWatch()
    }

    func resetSession() {
        state.resetSession()
        saveState()
        syncToWatch()
    }

    func changeBead(_ type: BeadType) {
        state.currentBeadType = type
        saveState()
        syncToWatch()
    }

    // MARK: - 持久化
    private func saveState() {
        if let data = try? JSONEncoder().encode(state) {
            UserDefaults.standard.set(data, forKey: stateKey)
        }
    }

    private func loadState() {
        if let data = UserDefaults.standard.data(forKey: stateKey),
           let saved = try? JSONDecoder().decode(ZenState.self, from: data) {
            state = saved
        }
    }

    // MARK: - Watch Connectivity
    private func setupWatchConnectivity() {
        guard WCSession.isSupported() else { return }
        session = WCSession.default
        session?.delegate = self
        session?.activate()
    }

    func syncToWatch() {
        guard let session = session, session.isReachable else { return }
        let message: [String: Any] = [
            WCMessageKey.merit: state.totalMerit,
            WCMessageKey.sessionMerit: state.sessionMerit,
            WCMessageKey.level: state.currentLevel.rawValue,
            WCMessageKey.beadType: state.currentBeadType.rawValue
        ]
        session.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }
}

// MARK: - WCSessionDelegate
extension ZenStore: WCSessionDelegate {
    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        DispatchQueue.main.async {
            self.isWatchConnected = (activationState == .activated)
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async {
            if let action = message[WCMessageKey.action] as? String {
                switch action {
                case WCMessageKey.addMerit:
                    if let amount = message[WCMessageKey.amount] as? Int {
                        self.addMerit(amount)
                    }
                case WCMessageKey.resetSession:
                    self.resetSession()
                default:
                    break
                }
            }
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        DispatchQueue.main.async {
            self.isWatchConnected = session.isReachable
        }
    }
}
