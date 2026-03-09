// ZenGardenApp.swift
// 禅定花园 - iOS 应用入口

import SwiftUI

@main
struct ZenGardenApp: App {
    @StateObject private var zenStore = ZenStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(zenStore)
                .preferredColorScheme(.dark)
        }
    }
}
