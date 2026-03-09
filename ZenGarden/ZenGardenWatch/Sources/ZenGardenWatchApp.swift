// ZenGardenWatchApp.swift
// 禅定花园 - watchOS 应用入口

import SwiftUI

@main
struct ZenGardenWatchApp: App {
    @StateObject private var watchStore = WatchStore()

    var body: some Scene {
        WindowGroup {
            WatchContentView()
                .environmentObject(watchStore)
        }
    }
}
