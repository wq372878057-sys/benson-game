import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import { SKILLS, getRandomSkills } from '@/lib/game-config';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SkillSelectScreen() {
  const { state, dispatch } = useGame();

  // 随机选择3个技能 - 三选一机制
  const selectedSkills = getRandomSkills(3);

  const handleSelectSkill = async (skillId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // 根据技能类型应用效果
    const skill = SKILLS.find((s) => s.id === skillId);
    if (skill) {
      // 这里可以根据技能效果类型应用不同的升级
      // 目前简单地应用技能并进入下一波
    }

    dispatch({ type: 'APPLY_SKILL', payload: skillId });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center gap-6 px-6 py-8">
          {/* 标题 */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-primary">第 {state.currentWave} 波完成！</Text>
            <Text className="text-base text-muted">选择一个技能升级继续战斗</Text>
          </View>

          {/* 技能卡片 - 三选一 */}
          <View className="gap-4 w-full max-w-sm">
            {selectedSkills.map((skill, index) => (
              <Pressable
                key={skill.id}
                onPress={() => handleSelectSkill(skill.id)}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                className="bg-surface rounded-2xl p-5 border-2 border-primary"
              >
                <View className="flex-row items-center gap-4">
                  <View className="bg-primary rounded-full w-12 h-12 items-center justify-center">
                    <Text className="text-2xl">{skill.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">{skill.name}</Text>
                    <Text className="text-sm text-muted mt-1">{skill.description}</Text>
                  </View>
                  <Text className="text-2xl text-success font-bold">{index + 1}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* 当前状态 */}
          <View className="bg-surface rounded-lg p-4 w-full max-w-sm mt-4 border border-border">
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted">生命值</Text>
              <Text className="text-sm font-bold text-primary">
                {state.playerHealth}/{state.playerMaxHealth}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted">伤害</Text>
              <Text className="text-sm font-bold text-primary">{state.damage.toFixed(1)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">得分</Text>
              <Text className="text-sm font-bold text-success">{state.score}</Text>
            </View>
          </View>

          {/* 波次进度 */}
          <View className="w-full max-w-sm mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-muted">波次进度</Text>
              <Text className="text-xs font-bold text-muted">
                {state.currentWave}/10
              </Text>
            </View>
            <View className="h-2 bg-surface rounded-full overflow-hidden border border-border">
              <View
                className="h-full bg-primary"
                style={{ width: `${(state.currentWave / 10) * 100}%` }}
              />
            </View>
          </View>

          {/* 提示信息 */}
          <Text className="text-xs text-muted text-center mt-4">
            💡 选择合适的技能升级，击败所有10波怪物即可通关！
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
