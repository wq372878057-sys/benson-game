// swift-tools-version: 5.9
// ZenGarden - Swift Package Manager 配置
// 注意：实际 iOS/watchOS 项目需要使用 Xcode 项目文件（.xcodeproj）
// 本文件仅用于代码组织参考

import PackageDescription

let package = Package(
    name: "ZenGarden",
    platforms: [
        .iOS(.v16),
        .watchOS(.v9)
    ],
    products: [
        .library(
            name: "ZenGardenShared",
            targets: ["ZenGardenShared"]
        )
    ],
    targets: [
        .target(
            name: "ZenGardenShared",
            path: "Shared/Sources"
        )
    ]
)
