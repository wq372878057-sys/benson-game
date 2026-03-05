import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function GameOverScreen() {
  const { state, dispatch } = useGame();

  const handleRetry = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center gap-8 px-6">
          {/* 失败动画 */}
          <Text className="text-7xl">💀</Text>

          {/* 标题 */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-error">游戏结束</Text>
            <Text className="text-lg text-muted">在第 {state.currentWave} 波被击败</Text>
          </View>

          {/* 成绩统计 */}
          <View className="bg-surface rounded-2xl p-8 w-full max-w-sm gap-4 border border-border">
            <View className="items-center gap-2 pb-4 border-b border-border">
              <Text className="text-5xl font-bold text-success">{state.score}</Text>
              <Text className="text-sm text-muted">最终得分</Text>
            </View>

            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">{state.currentWave}/10</Text>
                <Text className="text-xs text-muted mt-1">完成波次</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">{state.damage.toFixed(1)}</Text>
                <Text className="text-xs text-muted mt-1">最终伤害</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-error">0</Text>
                <Text className="text-xs text-muted mt-1">剩余生命</Text>
              </View>
            </View>
          </View>

          {/* 重新开始按钮 */}
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-primary px-12 py-4 rounded-full"
          >
            <Text className="text-xl font-bold text-background">重新开始</Text>
          </Pressable>

          {/* 提示 */}
          <Text className="text-sm text-muted text-center">
            再试一次，下次一定能赢！
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
