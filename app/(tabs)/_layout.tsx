import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Platform, Text, View } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useGame } from '@/lib/game-context';

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useGame();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  const handleTabPress = (screen: string) => {
    dispatch({ type: 'SET_SCREEN', payload: screen as any });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -4,
        },
      }}
    >
      {/* 战斗界面 */}
      <Tabs.Screen
        name="battle"
        listeners={{
          tabPress: (e) => {
            handleTabPress('battle');
          },
        }}
        options={{
          title: '战斗',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <Text className="text-xl">⚔️</Text>
            </View>
          ),
          tabBarLabel: '战斗',
        }}
      />

      {/* 角色界面 */}
      <Tabs.Screen
        name="character"
        listeners={{
          tabPress: (e) => {
            handleTabPress('character');
          },
        }}
        options={{
          title: '角色',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <Text className="text-xl">👤</Text>
            </View>
          ),
          tabBarLabel: '角色',
        }}
      />

      {/* 背包界面 */}
      <Tabs.Screen
        name="backpack"
        listeners={{
          tabPress: (e) => {
            handleTabPress('backpack');
          },
        }}
        options={{
          title: '背包',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <Text className="text-xl">🎒</Text>
            </View>
          ),
          tabBarLabel: '背包',
        }}
      />

      {/* 商店界面 */}
      <Tabs.Screen
        name="shop"
        listeners={{
          tabPress: (e) => {
            handleTabPress('shop');
          },
        }}
        options={{
          title: '商店',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <Text className="text-xl">🏪</Text>
            </View>
          ),
          tabBarLabel: '商店',
        }}
      />

      {/* 其他隐藏屏幕 */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          title: '首页',
        }}
      />

      <Tabs.Screen
        name="level-select"
        options={{
          href: null,
          title: '选择关卡',
        }}
      />

      <Tabs.Screen
        name="skill-select"
        options={{
          href: null,
          title: '选择技能',
        }}
      />

      <Tabs.Screen
        name="victory"
        options={{
          href: null,
          title: '通关成功',
        }}
      />

      <Tabs.Screen
        name="game-over"
        options={{
          href: null,
          title: '游戏结束',
        }}
      />
    </Tabs>
  );
}
