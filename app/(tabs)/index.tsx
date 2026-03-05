import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { state, dispatch } = useGame();

  const handleStartBattle = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch({ type: 'SET_SCREEN', payload: 'levelSelect' });
  };

  const handleCharacter = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: 导航到角色界面
  };

  const handleBackpack = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: 导航到背包界面
  };

  const handleShop = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: 导航到商店界面
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 px-6 py-8">
          {/* 顶部 - 游戏标题和用户信息 */}
          <View className="items-center gap-2 pt-4">
            <Text className="text-5xl font-bold text-primary">生存者传说</Text>
            <Text className="text-lg text-muted">Survivor Rogue</Text>
          </View>

          {/* 用户信息卡片 */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center gap-4">
              <View className="bg-primary rounded-full w-16 h-16 items-center justify-center">
                <Text className="text-4xl">🧙</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">冒险者</Text>
                <Text className="text-sm text-muted mt-1">等级: 1</Text>
                <Text className="text-sm text-success mt-1">最高得分: {state.score}</Text>
              </View>
            </View>
          </View>

          {/* 主要按钮 - 开始战斗 */}
          <Pressable
            onPress={handleStartBattle}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-primary px-8 py-6 rounded-2xl items-center justify-center"
          >
            <Text className="text-2xl mb-2">⚔️</Text>
            <Text className="text-xl font-bold text-background">开始战斗</Text>
          </Pressable>

          {/* 功能菜单 */}
          <View className="gap-3">
            {/* 第一行 - 角色和背包 */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleCharacter}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                className="flex-1 bg-surface rounded-xl p-4 border border-border items-center"
              >
                <Text className="text-3xl mb-2">👤</Text>
                <Text className="text-sm font-bold text-foreground">角色</Text>
              </Pressable>

              <Pressable
                onPress={handleBackpack}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                className="flex-1 bg-surface rounded-xl p-4 border border-border items-center"
              >
                <Text className="text-3xl mb-2">🎒</Text>
                <Text className="text-sm font-bold text-foreground">背包</Text>
              </Pressable>

              <Pressable
                onPress={handleShop}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                className="flex-1 bg-surface rounded-xl p-4 border border-border items-center"
              >
                <Text className="text-3xl mb-2">🏪</Text>
                <Text className="text-sm font-bold text-foreground">商店</Text>
              </Pressable>
            </View>
          </View>

          {/* 游戏特性 */}
          <View className="bg-surface rounded-xl p-4 border border-border gap-3">
            <Text className="text-base font-bold text-foreground">游戏特性</Text>
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">⚡</Text>
                <Text className="text-sm text-muted flex-1">自动瞄准射击</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">🎯</Text>
                <Text className="text-sm text-muted flex-1">10波挑战关卡</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">✨</Text>
                <Text className="text-sm text-muted flex-1">8种子弹升级技能</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">🔫</Text>
                <Text className="text-sm text-muted flex-1">波次三选一技能</Text>
              </View>
            </View>
          </View>

          {/* 底部信息 */}
          <View className="items-center gap-1 pb-4">
            <Text className="text-xs text-muted">版本 1.1.0</Text>
            <Text className="text-xs text-muted">© 2026 生存者传说</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
