import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const levels = [
  {
    id: 1,
    name: '森林之战',
    description: '绿色森林中的怪物',
    difficulty: '简单',
    icon: '🌲',
    color: '#2D5016',
    tips: '适合新手，怪物移动缓慢',
  },
  {
    id: 2,
    name: '火焰地狱',
    description: '炽热岩浆中的怪物',
    difficulty: '困难',
    icon: '🔥',
    color: '#8B0000',
    tips: '挑战高手，怪物速度快',
  },
];

export default function LevelSelectScreen() {
  const { dispatch } = useGame();

  const handleSelectLevel = async (levelId: 1 | 2) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    dispatch({ type: 'SELECT_LEVEL', payload: levelId });
    dispatch({ type: 'START_BATTLE' });
  };

  const handleBack = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch({ type: 'SET_SCREEN', payload: 'battle' });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center gap-6 px-6 py-8">
          {/* 标题 */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-primary">选择关卡</Text>
            <Text className="text-sm text-muted">每个关卡10波，每波10个怪物</Text>
          </View>

          {/* 关卡卡片 */}
          <View className="gap-4 w-full max-w-sm">
            {levels.map((level) => (
              <Pressable
                key={level.id}
                onPress={() => handleSelectLevel(level.id as 1 | 2)}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                className="bg-surface rounded-2xl p-6 border-2 border-border"
              >
                <View className="gap-3">
                  {/* 顶部 - 图标和名称 */}
                  <View className="flex-row items-center gap-4">
                    <Text className="text-5xl">{level.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-2xl font-bold text-foreground">
                        {level.name}
                      </Text>
                      <Text className="text-sm text-muted mt-1">{level.description}</Text>
                    </View>
                  </View>

                  {/* 难度标签 */}
                  <View className="flex-row items-center gap-2">
                    <View className="bg-primary px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-background">
                        {level.difficulty}
                      </Text>
                    </View>
                    <Text className="text-xs text-muted flex-1">{level.tips}</Text>
                  </View>

                  {/* 关卡信息 */}
                  <View className="flex-row gap-4 pt-2 border-t border-border">
                    <View className="flex-1 items-center">
                      <Text className="text-lg font-bold text-primary">10</Text>
                      <Text className="text-xs text-muted">波次</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Text className="text-lg font-bold text-primary">10</Text>
                      <Text className="text-xs text-muted">敌人/波</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Text className="text-lg font-bold text-success">100</Text>
                      <Text className="text-xs text-muted">最高分</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* 返回按钮 */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="mt-4"
          >
            <Text className="text-base text-primary font-semibold">← 返回主页</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
