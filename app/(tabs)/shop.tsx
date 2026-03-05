import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game-context';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const subscriptionCards = [
  {
    id: 'weekly',
    name: '周卡',
    price: '¥6',
    duration: '7天',
    benefits: ['每日签到奖励', '商店折扣10%', '经验加成50%'],
  },
  {
    id: 'monthly',
    name: '月卡',
    price: '¥18',
    duration: '30天',
    benefits: ['每日签到奖励', '商店折扣15%', '经验加成100%', '每周额外宝石'],
  },
  {
    id: 'quarterly',
    name: '季卡',
    price: '¥48',
    duration: '90天',
    benefits: ['每日签到奖励', '商店折扣20%', '经验加成150%', '每周额外宝石', '专属皮肤'],
  },
  {
    id: 'yearly',
    name: '年卡',
    price: '¥128',
    duration: '365天',
    benefits: ['每日签到奖励', '商店折扣25%', '经验加成200%', '每周额外宝石', '专属皮肤', 'VIP特权'],
  },
];

const specialCards = [
  {
    id: 'equipment',
    name: '装备礼包',
    icon: '🎁',
    price: '¥9.99',
    contents: ['稀有装备x1', '装备碎片x10', '强化石x5'],
  },
  {
    id: 'gems',
    name: '宝石礼包',
    icon: '💎',
    price: '¥19.99',
    contents: ['宝石x100', '水晶石x20', '经验书x10'],
  },
  {
    id: 'coins',
    name: '金币礼包',
    icon: '🪙',
    price: '¥4.99',
    contents: ['金币x50000', '经验书x5', '幸运礼盒x1'],
  },
];

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'special'>('subscription');

  const handlePurchase = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: 购买逻辑
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 gap-6 px-6 py-8">
          {/* 标题 */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-primary">商店</Text>
            <Text className="text-sm text-muted">购买礼包和道具</Text>
          </View>

          {/* 标签页 */}
          <View className="flex-row gap-3 bg-surface rounded-lg p-1 border border-border">
            <Pressable
              onPress={() => setActiveTab('subscription')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className={`flex-1 py-2 rounded-md items-center ${
                activeTab === 'subscription' ? 'bg-primary' : ''
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === 'subscription' ? 'text-background' : 'text-foreground'
                }`}
              >
                订阅礼包
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('special')}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className={`flex-1 py-2 rounded-md items-center ${
                activeTab === 'special' ? 'bg-primary' : ''
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  activeTab === 'special' ? 'text-background' : 'text-foreground'
                }`}
              >
                特惠礼包
              </Text>
            </Pressable>
          </View>

          {/* 订阅礼包 */}
          {activeTab === 'subscription' && (
            <View className="gap-4">
              {subscriptionCards.map((card) => (
                <View
                  key={card.id}
                  className="bg-surface rounded-lg p-4 border-2 border-border overflow-hidden"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="text-lg font-bold text-primary">{card.name}</Text>
                      <Text className="text-sm text-muted mt-1">{card.duration}</Text>
                    </View>
                    <Text className="text-2xl font-bold text-success">{card.price}</Text>
                  </View>

                  {/* 权限列表 */}
                  <View className="gap-2 mb-4 py-3 border-t border-border">
                    {card.benefits.map((benefit, index) => (
                      <View key={index} className="flex-row items-center gap-2">
                        <Text className="text-lg">✓</Text>
                        <Text className="text-sm text-muted">{benefit}</Text>
                      </View>
                    ))}
                  </View>

                  {/* 购买按钮 */}
                  <Pressable
                    onPress={handlePurchase}
                    style={({ pressed }) => [
                      {
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                    className="bg-primary py-2 rounded-lg items-center"
                  >
                    <Text className="text-sm font-bold text-background">立即购买</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* 特惠礼包 */}
          {activeTab === 'special' && (
            <View className="gap-4">
              {specialCards.map((card) => (
                <View
                  key={card.id}
                  className="bg-surface rounded-lg p-4 border-2 border-border overflow-hidden"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-4xl">{card.icon}</Text>
                      <View>
                        <Text className="text-lg font-bold text-primary">{card.name}</Text>
                      </View>
                    </View>
                    <Text className="text-2xl font-bold text-success">{card.price}</Text>
                  </View>

                  {/* 内容列表 */}
                  <View className="gap-2 mb-4 py-3 border-t border-border">
                    {card.contents.map((content, index) => (
                      <View key={index} className="flex-row items-center gap-2">
                        <Text className="text-lg">📦</Text>
                        <Text className="text-sm text-muted">{content}</Text>
                      </View>
                    ))}
                  </View>

                  {/* 购买按钮 */}
                  <Pressable
                    onPress={handlePurchase}
                    style={({ pressed }) => [
                      {
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                    className="bg-primary py-2 rounded-lg items-center"
                  >
                    <Text className="text-sm font-bold text-background">立即购买</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
