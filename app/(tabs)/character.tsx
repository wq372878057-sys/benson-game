import { ScrollView, Text, View, Pressable, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const equipmentSlots = [
  { key: 'helmet', name: '头盔', position: 'top-left' },
  { key: 'armor', name: '衣服', position: 'top-right' },
  { key: 'gloves', name: '手套', position: 'middle-left' },
  { key: 'pants', name: '裤子', position: 'middle-right' },
  { key: 'boots', name: '足具', position: 'bottom-left' },
  { key: 'bracers', name: '护臂', position: 'bottom-right' },
];

export default function CharacterScreen() {
  const { state, dispatch } = useGame();

  const handleEquipmentUpgrade = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: 装备升级逻辑
  };

  const handleQualityUpgrade = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: 品质升阶逻辑
  };

  // 如枟当前不是角色屏幕，不渲染
  if (state.currentScreen !== 'character') {
    return null;
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 px-6 py-8">
          {/* 标题 */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-primary">角色</Text>
            <Text className="text-sm text-muted">装备与升级</Text>
          </View>

          {/* 角色信息卡片 */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="items-center gap-4">
              {/* 主角形象 */}
              <View className="rounded-full w-24 h-24 items-center justify-center overflow-hidden border-2 border-primary">
                <Image
                  source={require('@/assets/images/player.jpg')}
                  style={{ width: 96, height: 96 }}
                  resizeMode="cover"
                />
              </View>

              {/* 等级和战力 */}
              <View className="items-center gap-2">
                <Text className="text-2xl font-bold text-foreground">
                  等级 {state.playerLevel}
                </Text>
                <Text className="text-lg text-muted">战力值: {state.playerPower}</Text>
              </View>
            </View>
          </View>

          {/* 装备槽位 */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">装备槽位</Text>

            {/* 第一行 - 头盔和衣服 */}
            <View className="flex-row gap-3">
              {equipmentSlots.slice(0, 2).map((slot) => (
                <View key={slot.key} className="flex-1">
                  <View className="bg-surface rounded-lg p-3 border-2 border-border items-center gap-2">
                    <Text className="text-3xl">
                      {slot.key === 'helmet' ? '🎩' : '👕'}
                    </Text>
                    <Text className="text-xs text-muted text-center">{slot.name}</Text>
                    <Text className="text-xs font-bold text-primary">
                      {state.equippedItems[slot.key as keyof typeof state.equippedItems]
                        ? state.equippedItems[slot.key as keyof typeof state.equippedItems]?.name
                        : '未装备'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* 第二行 - 手套和裤子 */}
            <View className="flex-row gap-3">
              {equipmentSlots.slice(2, 4).map((slot) => (
                <View key={slot.key} className="flex-1">
                  <View className="bg-surface rounded-lg p-3 border-2 border-border items-center gap-2">
                    <Text className="text-3xl">
                      {slot.key === 'gloves' ? '🧤' : '👖'}
                    </Text>
                    <Text className="text-xs text-muted text-center">{slot.name}</Text>
                    <Text className="text-xs font-bold text-primary">
                      {state.equippedItems[slot.key as keyof typeof state.equippedItems]
                        ? state.equippedItems[slot.key as keyof typeof state.equippedItems]?.name
                        : '未装备'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* 第三行 - 足具和护臂 */}
            <View className="flex-row gap-3">
              {equipmentSlots.slice(4, 6).map((slot) => (
                <View key={slot.key} className="flex-1">
                  <View className="bg-surface rounded-lg p-3 border-2 border-border items-center gap-2">
                    <Text className="text-3xl">
                      {slot.key === 'boots' ? '👢' : '🛡️'}
                    </Text>
                    <Text className="text-xs text-muted text-center">{slot.name}</Text>
                    <Text className="text-xs font-bold text-primary">
                      {state.equippedItems[slot.key as keyof typeof state.equippedItems]
                        ? state.equippedItems[slot.key as keyof typeof state.equippedItems]?.name
                        : '未装备'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 属性统计 */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-sm font-bold text-foreground">属性统计</Text>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">攻击力</Text>
              <Text className="text-sm font-bold text-primary">{state.damage.toFixed(1)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">防御力</Text>
              <Text className="text-sm font-bold text-primary">50</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">生命值</Text>
              <Text className="text-sm font-bold text-primary">{state.playerMaxHealth}</Text>
            </View>
          </View>

          {/* 升级按钮 */}
          <View className="gap-3">
            <Pressable
              onPress={handleEquipmentUpgrade}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="bg-primary px-6 py-3 rounded-lg items-center"
            >
              <Text className="text-base font-bold text-background">装备升级</Text>
            </Pressable>

            <Pressable
              onPress={handleQualityUpgrade}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="bg-success px-6 py-3 rounded-lg items-center"
            >
              <Text className="text-base font-bold text-background">品质升阶</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
