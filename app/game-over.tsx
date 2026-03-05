import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function GameOverScreen() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  const handleRetry = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch({ type: 'RESET_GAME' });
    router.push('/level-select' as any);
  };

  const handleReturnHome = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch({ type: 'RESET_GAME' });
    router.push('/(tabs)/battle' as any);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center gap-6 px-6 py-8">
          {/* 失败标题 */}
          <View className="items-center gap-4">
            <Text className="text-6xl">💀</Text>
            <Text className="text-4xl font-bold text-error">游戏结束</Text>
            <Text className="text-lg text-muted">您在第 {state.currentWave} 波被击败</Text>
          </View>

          {/* 统计信息 */}
          <View className="bg-surface rounded-2xl p-6 w-full max-w-sm border-2 border-error gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">本局得分</Text>
              <Text className="text-3xl font-bold text-warning">{state.score}</Text>
            </View>

            <View className="border-t border-border pt-4 gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">完成波次</Text>
                <Text className="text-sm font-bold text-primary">{state.currentWave}/10</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">生命值</Text>
                <Text className="text-sm font-bold text-error">{state.playerHealth}/100</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">总伤害输出</Text>
                <Text className="text-sm font-bold text-primary">{(state.damage * 100).toFixed(0)}</Text>
              </View>
            </View>
          </View>

          {/* 提示信息 */}
          <View className="bg-warning/20 rounded-lg p-4 w-full max-w-sm border border-warning gap-2">
            <Text className="text-sm font-bold text-warning">💡 提示</Text>
            <Text className="text-xs text-muted">
              {state.currentWave < 5
                ? '前几波难度较低，继续加油！'
                : state.currentWave < 8
                  ? '已经坚持到了中期，再接再厉！'
                  : '距离成功只差一步了，不要放弃！'}
            </Text>
          </View>

          {/* 重试按钮 */}
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-primary px-12 py-3 rounded-full w-full max-w-sm items-center mt-6"
          >
            <Text className="text-lg font-bold text-background">重新开始</Text>
          </Pressable>

          {/* 返回主页按钮 */}
          <Pressable
            onPress={handleReturnHome}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-surface px-12 py-3 rounded-full w-full max-w-sm items-center border border-border"
          >
            <Text className="text-lg font-bold text-foreground">返回主页</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
