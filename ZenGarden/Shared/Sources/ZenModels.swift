// ZenModels.swift
// 禅定花园 - 共享数据模型
// 适用于 iOS 和 watchOS

import Foundation

// MARK: - 境界等级
enum ZenLevel: Int, CaseIterable, Codable {
    case level1 = 1
    case level2 = 2
    case level3 = 3
    case level4 = 4
    case level5 = 5
    case level6 = 6
    case level7 = 7
    case level8 = 8
    case level9 = 9
    case level10 = 10

    var name: String {
        switch self {
        case .level1: return "破败佛斋"
        case .level2: return "修缮茅屋"
        case .level3: return "石基木屋"
        case .level4: return "清雅禅院"
        case .level5: return "大殿初成"
        case .level6: return "宏伟寺庙"
        case .level7: return "琉璃净土"
        case .level8: return "莲池海会"
        case .level9: return "妙音天国"
        case .level10: return "西方极乐世界"
        }
    }

    var requiredMerit: Int {
        switch self {
        case .level1: return 0
        case .level2: return 1_000
        case .level3: return 5_000
        case .level4: return 20_000
        case .level5: return 100_000
        case .level6: return 500_000
        case .level7: return 2_000_000
        case .level8: return 10_000_000
        case .level9: return 50_000_000
        case .level10: return 100_000_000
        }
    }

    var description: String {
        switch self {
        case .level1: return "四壁漏风，破洞丛生，一阵市涌流纹的墙壁，一只破旧的蒲团，一盏将灭的油灯。然而，即使在最破败之处，佛心依然存在。"
        case .level2: return "简陋茅屋已修缮，遮风挡雨有余，禅心渐稳，修行之路初现曙光。"
        case .level3: return "石基稳固，木屋清幽，晨钟暮鼓，禅意渐浓，心境渐入佳境。"
        case .level4: return "清雅禅院，竹影婆娑，一泓清泉，洗涤尘心，禅定功夫日深。"
        case .level5: return "大殿巍峨，香烟袅袅，钟声悠远，信众云集，佛法广布。"
        case .level6: return "宏伟寺庙，金碧辉煌，佛像庄严，法相庄严，修行功德无量。"
        case .level7: return "琉璃净土，光明遍照，七宝庄严，诸佛菩萨，常住其中。"
        case .level8: return "莲池海会，圣众云集，莲花化生，妙法宣流，功德圆满。"
        case .level9: return "妙音天国，天乐自鸣，天花乱坠，诸天赞叹，无上妙境。"
        case .level10: return "西方极乐世界，阿弥陀佛，无量光寿，究竟圆满，永离苦海。"
        }
    }

    var imageName: String {
        return "temple_level_\(rawValue)"
    }

    static func level(for merit: Int) -> ZenLevel {
        var currentLevel = ZenLevel.level1
        for level in ZenLevel.allCases.reversed() {
            if merit >= level.requiredMerit {
                currentLevel = level
                break
            }
        }
        return currentLevel
    }

    var next: ZenLevel? {
        return ZenLevel(rawValue: rawValue + 1)
    }
}

// MARK: - 佛珠类型
enum BeadType: String, CaseIterable, Codable {
    case bodhi = "菩提珠"
    case glass = "琉璃珠"
    case redAgate = "红玛瑙珠"

    var colorHex: String {
        switch self {
        case .bodhi: return "#C8A96E"
        case .glass: return "#7EC8E3"
        case .redAgate: return "#C0392B"
        }
    }

    var systemImageName: String {
        switch self {
        case .bodhi: return "circle.fill"
        case .glass: return "circle.fill"
        case .redAgate: return "circle.fill"
        }
    }
}

// MARK: - 修行数据
struct ZenState: Codable {
    var totalMerit: Int = 0
    var sessionMerit: Int = 0
    var currentBeadType: BeadType = .bodhi
    var currentLevel: ZenLevel = .level1
    var levelMerits: [Int: Int] = [:]

    mutating func addMerit(_ amount: Int) {
        totalMerit += amount
        sessionMerit += amount
        levelMerits[currentLevel.rawValue, default: 0] += amount
        currentLevel = ZenLevel.level(for: totalMerit)
    }

    mutating func resetSession() {
        sessionMerit = 0
    }

    var progressToNextLevel: Double {
        guard let nextLevel = currentLevel.next else { return 1.0 }
        let current = Double(totalMerit - currentLevel.requiredMerit)
        let total = Double(nextLevel.requiredMerit - currentLevel.requiredMerit)
        return min(current / total, 1.0)
    }

    var meritToNextLevel: Int {
        guard let nextLevel = currentLevel.next else { return 0 }
        return nextLevel.requiredMerit - totalMerit
    }
}

// MARK: - WatchConnectivity 消息键
struct WCMessageKey {
    static let merit = "merit"
    static let sessionMerit = "sessionMerit"
    static let level = "level"
    static let beadType = "beadType"
    static let action = "action"
    static let addMerit = "addMerit"
    static let amount = "amount"
    static let resetSession = "resetSession"
    static let syncState = "syncState"
}

// MARK: - 格式化工具
extension Int {
    var meritFormatted: String {
        if self >= 100_000_000 {
            return String(format: "%.1f亿", Double(self) / 100_000_000)
        } else if self >= 10_000 {
            return String(format: "%.1f万", Double(self) / 10_000)
        } else {
            return "\(self)"
        }
    }
}
