import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';

const backpackItems = [
  { name: '头盔', icon: '🎩', type: 'equipment' },
  { name: '衣服', icon: '👕', type: 'equipment' },
  { name: '手套', icon: '🧤', type: 'equipment' },
  { name: '裤子', icon: '👖', type: 'equipment' },
  { name: '足具', icon: '👢', type: 'equipment' },
  { name: '护臂', icon: '🛡️', type: 'equipment' },
  { name: '蓝宝石', icon: '💙', type: 'gem' },
  { name: '绿宝石', icon: '💚', type: 'gem' },
  { name: '红宝石', icon: '❤️', type: 'gem' },
  { name: '紫宝石', icon: '💜', type: 'gem' },
  { name: '黄宝石', icon: '💛', type: 'gem' },
  { name: '水晶石', icon: '💎', type: 'gem' },
  { name: '金币', icon: '🪙', type: 'coin' },
];

export default function BackpackScreen() {
  const { state } = useGame();

  // 生成随机装备碎片
  const fragmentItems = Array.from({ length: 5 }).map((_, i) => ({
    name: `装备碎片 ${i + 1}`,
    icon: '🔨',
    type: 'fragment',
  }));

  const allItems = [...backpackItems, ...fragmentItems];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 px-6 py-8">
          {/* 标题 */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-primary">背包</Text>
            <Text className="text-sm text-muted">查看和管理您的物品</Text>
          </View>

          {/* 背包统计 */}
          <View className="bg-surface rounded-lg p-4 border border-border flex-row justify-around">
            <View className="items-center">
              <Text className="text-lg font-bold text-primary">{state.coins}</Text>
              <Text className="text-xs text-muted mt-1">金币</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-primary">{state.gems.crystal}</Text>
              <Text className="text-xs text-muted mt-1">水晶</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-primary">{state.backpack.length}</Text>
              <Text className="text-xs text-muted mt-1">物品</Text>
            </View>
          </View>

          {/* 装备 */}
          <View className="gap-3">
            <Text className="text-base font-bold text-foreground">装备</Text>
            <View className="flex-row flex-wrap gap-2">
              {backpackItems.slice(0, 6).map((item, index) => (
                <View
                  key={index}
                  className="flex-1 min-w-[30%] bg-surface rounded-lg p-3 border border-border items-center gap-1"
                >
                  <Text className="text-2xl">{item.icon}</Text>
                  <Text className="text-xs text-muted text-center">{item.name}</Text>
                  <Text className="text-xs font-bold text-primary">x1</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 宝石 */}
          <View className="gap-3">
            <Text className="text-base font-bold text-foreground">宝石</Text>
            <View className="flex-row flex-wrap gap-2">
              {backpackItems.slice(6, 12).map((item, index) => (
                <View
                  key={index}
                  className="flex-1 min-w-[30%] bg-surface rounded-lg p-3 border border-border items-center gap-1"
                >
                  <Text className="text-2xl">{item.icon}</Text>
                  <Text className="text-xs text-muted text-center">{item.name}</Text>
                  <Text className="text-xs font-bold text-primary">
                    x{state.gems[item.name.toLowerCase().split('')[0]] || 10}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 货币 */}
          <View className="gap-3">
            <Text className="text-base font-bold text-foreground">货币</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl">🪙</Text>
                  <Text className="text-base text-foreground">金币</Text>
                </View>
                <Text className="text-lg font-bold text-success">{state.coins}</Text>
              </View>
            </View>
          </View>

          {/* 装备碎片 */}
          <View className="gap-3">
            <Text className="text-base font-bold text-foreground">装备碎片</Text>
            <View className="flex-row flex-wrap gap-2">
              {fragmentItems.map((item, index) => (
                <View
                  key={index}
                  className="flex-1 min-w-[30%] bg-surface rounded-lg p-3 border border-border items-center gap-1"
                >
                  <Text className="text-2xl">{item.icon}</Text>
                  <Text className="text-xs text-muted text-center">{item.name}</Text>
                  <Text className="text-xs font-bold text-primary">x1</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
