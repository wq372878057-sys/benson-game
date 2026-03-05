import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function VictoryScreen() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  const handleReturnHome = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    dispatch({ type: 'RESET_GAME' });
    router.push('/(tabs)/battle' as any);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center gap-6 px-6 py-8">
          {/* 成功标题 */}
          <View className="items-center gap-4">
            <Text className="text-6xl">🎉</Text>
            <Text className="text-4xl font-bold text-success">通关成功！</Text>
            <Text className="text-lg text-muted">恭喜击败所有10波怪物</Text>
          </View>

          {/* 统计信息 */}
          <View className="bg-surface rounded-2xl p-6 w-full max-w-sm border-2 border-success gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">最终得分</Text>
              <Text className="text-3xl font-bold text-success">{state.score}</Text>
            </View>

            <View className="border-t border-border pt-4 gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">完成波次</Text>
                <Text className="text-sm font-bold text-primary">10/10</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">生命值剩余</Text>
                <Text className="text-sm font-bold text-primary">{state.playerHealth}/100</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">总伤害输出</Text>
                <Text className="text-sm font-bold text-primary">{(state.damage * 100).toFixed(0)}</Text>
              </View>
            </View>
          </View>

          {/* 奖励信息 */}
          <View className="bg-primary/20 rounded-lg p-4 w-full max-w-sm border border-primary gap-2">
            <Text className="text-sm font-bold text-primary">🎁 获得奖励</Text>
            <View className="gap-1">
              <Text className="text-xs text-muted">• 金币 +500</Text>
              <Text className="text-xs text-muted">• 经验 +1000</Text>
              <Text className="text-xs text-muted">• 宝石 +50</Text>
            </View>
          </View>

          {/* 返回按钮 */}
          <Pressable
            onPress={handleReturnHome}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-success px-12 py-3 rounded-full w-full max-w-sm items-center mt-6"
          >
            <Text className="text-lg font-bold text-background">返回主页</Text>
          </Pressable>

          {/* 再来一次按钮 */}
          <Pressable
            onPress={() => {
              dispatch({ type: 'RESET_GAME' });
              router.push('/level-select' as any);
            }}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-primary px-12 py-3 rounded-full w-full max-w-sm items-center"
          >
            <Text className="text-lg font-bold text-background">再来一次</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
